"use strict";

angular.module("opsDashboard").controller("loginController", function(shared, $state, $scope, $mdSidenav, $mdComponentRegistry, $sessionStorage, LoginFactory){

    var ctrl = this;
	this.passwordLength	=	0;
    this.auth = shared.info.auth;

    this.toggle = angular.noop;

    this.title = $state.current.title;
	this.loginForm = function() {
        LoginFactory.loginUser(this.formData.username, this.formData.password).success(function(data) {
			var destination;

			if(data === "COO"){
				destination = 'coo-home';

			} else if(data === "OM"){
				destination = 'om-home';

			} else if(data === "OT"){
				destination = 'ot-home';
			}
			else {
				$state.go('login');
			}

			$state.go(destination);

        }).error(function(data) {
			 $scope.messages = data;
        });
    }
    this.getLength=function(value){
		if (angular.isUndefined(value) || value == null){

		}else{
			this.passwordLength = value.length;
			return value.length;
		}
	}
    this.isOpen = function() { return false };
    $mdComponentRegistry.when("left").then( function(sideNav){
      ctrl.isOpen = angular.bind( sideNav, sideNav.isOpen );
      ctrl.toggle = angular.bind( sideNav, sideNav.toggle );
    });

    this.toggleRight = function() {
    	$mdSidenav("left").toggle()
        	.then(function(){
        });
    };

    this.close = function() {
    	$mdSidenav("right").close()
        	.then(function(){
        });
    };

});

