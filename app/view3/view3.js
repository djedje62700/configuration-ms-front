'use strict';

angular.module('myApp.view3', ['ngRoute', 'ngMaterial'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view3', {
            templateUrl: 'view3/view3.html',
            controller: 'View3Ctrl',
            controllerAs: 'View3Ctrl'
        });
    }])

    .controller('View3Ctrl', ['$route', '$http', '$mdToast', '$mdDialog', function ($route, $http, $mdToast, $mdDialog) {
        var vm = this;
        vm.modules = [];
        vm.newBlocs = [];
        vm.blocs = [];
        vm.blocsName = "";

        /**
         * Effectue un appel /GET de la liste des modules
         */
        $http.get("http://localhost:1339/modules")
            .then(function (response) {
                vm.modules = response.data;

            }, function () {
                $mdToast.showSimple("Erreur lors de la récuperation des modules");
            });

        /**
         * Effectue un appel /GET de la liste des modules
         */
        $http.get("http://localhost:1339/blocs")
            .then(function (response) {
                vm.blocs = response.data;
            }, function () {
                $mdToast.showSimple("Erreur lors de la récuperation des blocs");
            });

        /**
         * Crée la liste d'objet d'un module à partir du current modules
         * @param modules
         */
        vm.listModules = function (modules) {
            vm.currentModules = modules;
            vm.actionButtonBlocs = true;
            vm.currentModules["added"] = true;
            if (vm.currentModules.added === true) {
                vm.newBlocs.push(vm.currentModules);
            }
            console.log(vm.newBlocs);
        };

        /**
         * Vide le formulaire de selection des modules
         */
        vm.clearBlocsObject = function () {
            $route.reload();
        };

        /**
         * Affiche une modal de création de blocs
         */
        vm.createNewBlocs = function () {
            $mdDialog.show({
                contentElement: '#blocs',
                parent: angular.element(document.body)
            });
        };

        /**
         * Effectue une requete /POST pour créer un nouveau module à partir d'une liste de composant et d'un titre
         */
        vm.postBlocs = function () {
            vm.blocsToPost = {
                title: vm.blocsName,
                modulesList : vm.newBlocs
            };
            $http.post("http://localhost:1339/blocs/", vm.blocsToPost)
                .then(function successPostModule() {
                    $mdDialog.hide();
                    $route.reload();
                    $mdToast.showSimple("Blocs " + vm.blocsToPost.title + " enregistré avec succés");
                }, function errorPostModule() {
                    $mdToast.showSimple("Erreur lors de l'enregistrement du Blocs");
                })
        };

        /**
         * récupere le current item à supprimer puis effectue une requete /DELETE
         * @param blocs
         */
        vm.deleteBlocs = function (blocs) {
            vm.currentBlocs = blocs;
            $http.delete('http://localhost:1339/blocs/' + vm.currentBlocs.id)
                .then(function successDeleteModule() {
                    $route.reload();
                    $mdToast.showSimple("Blocs supprimé avec succés");
                }, function errorDeleteModule() {
                    $mdToast.showSimple("Erreur lors de la suppression du blocs");
                })
        };

    }]);