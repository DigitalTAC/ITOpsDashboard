"use strict";

angular.module("opsDashboard").config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise("/login");

    $stateProvider.state("main", {
        url: "/main",
        templateUrl: "app/components/main/main.html",
        title: "Cordova Angular-Material",
        controller: "MainController",
        controllerAs: "main",
    })
	.state("coo-home", {
        url: "/coo-home",
        templateUrl: "app/components/coo-home/coo-home.html",
        title: "Dashboard",
        controller: "cooHomeController",
        controllerAs: "cooHome",
		data: {
			userRole: 'COO'
		}
    })
	.state("om-home", {
        url: "/om-home",
        templateUrl: "app/components/om-home/om-home.html",
        title: "Dashboard",
        controller: "omHomeController",
        controllerAs: "omHome",
		data: {
			userRole: 'OM'
		}
    })
	.state("ot-home", {
        url: "/ot-home",
        templateUrl: "app/components/ot-home/ot-home.html",
        title: "Dashboard",
        controller: "otHomeController",
        controllerAs: "otHome",
		data: {
			userRole: 'OT'
		}
    })
	.state("login", {
        url: "/login",
        templateUrl: "app/components/login/login.html",
        title: "Dashboard",
        controller: "loginController",
        controllerAs: "login",
		data: {
			userRole: null
		}
    });


}]);
