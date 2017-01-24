'use strict';

angular.module('myApp.view2', ['ngRoute', 'ngMaterial'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl',
            controllerAs: 'View2Ctrl'
        });
    }])

    .controller('View2Ctrl', ['$route', '$http', '$mdToast', '$mdDialog', function ($route, $http, $mdToast, $mdDialog) {
        var vm = this;
        vm.components = [];
        vm.newModule = [];
        vm.modules = [];
        vm.moduleName = "";
        const baseUrlApi = "https://madera-configuration-ms-api.herokuapp.com/";

        /**
         * Effectue un appel /GET de la liste des component
         */
        $http.get(baseUrlApi + "component")
            .then(function (response) {
                vm.components = response.data;
            }, function () {
                $mdToast.showSimple("Erreur lors de la récuperation des composants");
            });

        /**
         * Effectue un appel /GET de la liste des modules
         */
        $http.get(baseUrlApi + "modules")
            .then(function (response) {
                vm.modules = response.data;
            }, function () {
                $mdToast.showSimple("Erreur lors de la récuperation des modules");
            });

        /**
         * Crée la liste d'objet d'un module à partir du current component
         * @param components
         */
        vm.listComponent = function (components) {
            vm.currentComponent = components;
            vm.actionButton = true;
            vm.currentComponent["added"] = true;
            if (vm.currentComponent.added === true) {
                vm.newModule.push(vm.currentComponent);
            }
        };

        /**
         * Vide le formulaire de selection des composants
         */
        vm.clearModuleObject = function () {
            $route.reload();
        };

        /**
         * Affiche une modal de création de module
         */
        vm.createNewModule = function () {
            $mdDialog.show({
                contentElement: '#myStaticDialog',
                parent: angular.element(document.body)
            });
        };

        /**
         * Effectue une requete /POST pour créer un nouveau module à partir d'une liste de composant et d'un titre
         */
        vm.postModule = function () {
            vm.moduleToPost = {
                title: vm.moduleName,
                componentList: vm.newModule
            };
            $http.post(baseUrlApi + "modules/", vm.moduleToPost)
                .then(function successPostModule() {
                    $mdDialog.hide();
                    $route.reload();
                    $mdToast.showSimple("Module " + vm.moduleToPost.title + " enregistré avec succés");
                }, function errorPostModule() {
                    $mdToast.showSimple("Erreur lors de l'enregistrement du module");
                })
        };

        /**
         * récupere le current item à supprimer puis effectue une requete /DELETE
         * @param modules
         */
        vm.deleteModules = function (modules) {
            vm.currentModule = modules;
            $http.delete(baseUrlApi + "modules/" + vm.currentModule.id)
                .then(function successDeleteModule() {
                    $route.reload();
                    $mdToast.showSimple("Module supprimé avec succés");
                }, function errorDeleteModule() {
                    $mdToast.showSimple("Erreur lors de la suppression du module");
                })
        };

    }]);