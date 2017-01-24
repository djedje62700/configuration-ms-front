'use strict';

angular.module('myApp.view1', ['ngRoute', 'ngMaterial'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl',
            controllerAs: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$http', '$mdToast', '$route', function ($http, $mdToast, $route) {

        var vm = this;
        vm.componentList = [];
        const baseUrlApi = "https://madera-configuration-ms-api.herokuapp.com/";


        /**
         * Effectue une requete /get de la liste des composants sur l'API
         */
        $http.get(baseUrlApi + "component").then(function SuccessGet(response) {
            if (response.data && response.data.length != 0) {
                vm.componentList = response.data;
                $mdToast.showSimple("La liste des composants à été chargé avec succés");
            }
            else {
                console.log("is empty" + vm.componentList);
            }
        }, function ErrorGet(response) {
            console.log(response.statusText);
        });


        /**
         * Récupére le composant sur lequel on click
         * @param componentList
         */
        vm.getCurrentComponent = function (componentList) {
            vm.currentComponent = componentList;
            console.log(vm.currentComponent);
            $http.delete(baseUrlApi + "component/" + vm.currentComponent.id).then(function() {
                $route.reload();
                $mdToast.showSimple("Erreur lors de l'enregistrement du composant");
            })
        };

        /**
         * Affiche le current composant dans le formulaire d'edit
         * @param componentList
         */
        vm.showEditSection = function (componentList) {
            vm.currentComponent = componentList;
            console.log(vm.currentComponent);
            vm.showEditButton = true;
            vm.name = vm.currentComponent.name;
            vm.type = vm.currentComponent.type;
            vm.price = vm.currentComponent.price;
            vm.unitLength = vm.currentComponent.unitLength;
            vm.id = vm.currentComponent.id;
        };

        /**
         * Récupere le current item modifié et effectue une requete /PUT pour le modifier
         */
        vm.editCurrentComponent = function () {
            var componentToUpdate = {
                name: vm.name,
                type: vm.type,
                price : vm.price,
                unitLength: vm.unitLength
            };
            if(componentToUpdate !== undefined) {
                console.log(componentToUpdate);
                $http({
                    method: 'PUT',
                    url: baseUrlApi + "component/" + vm.id ,
                    data: componentToUpdate,
                    headers: {'Content-Type': 'application/json'}
                }).then(function (response) {
                    $mdToast.showSimple("Le composant " + response.data.name + " à été modifié avec succés");
                    $route.reload();
                }, function errorPost() {
                    $mdToast.showSimple("Erreur lors de l'enregistrement du composant");
                })
            }
        };




        /**
         * Crée un nouveau composant en envoyant une requete post en fonction des champs renseigné dans l'application
         */
        vm.createNewComponent = function () {
            var component = {
                name: vm.name,
                type: vm.type,
                price: vm.price,
                unitLength: vm.unitLength
            };
            if (component === undefined) {
                $mdToast.simple(componentNotification.emptyObject);
            } else {
                console.log(component);
                $http({
                    method: 'POST',
                    url: baseUrlApi + "component",
                    data: component,
                    headers: {'Content-Type': 'application/json'}
                }).then(function (response) {
                    $mdToast.showSimple("Le composant " + response.data.name + " à été crée avec succés");
                    $route.reload();
                }, function errorPost(response) {
                    $mdToast.showSimple("Erreur lors de l'enregistrement du composant");
                })
            }
        };


        /**
         * Supprime les valeurs inscrites dans le formulaire de création de composant
         */
        vm.emptyForm = function () {
            vm.name = "";
            vm.type = "";
            vm.price = "";
            vm.unitLength = "";
        }

    }]);