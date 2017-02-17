"use strict";

angular.module("opsDashboard", [ "ui.router", "ngMaterial", "ngCordova", "ngStorage", "angular-flot" ])
// ngTouch is No Longer Supported by Angular-Material

.run(function($rootScope, $state, $sessionStorage, shared, $cordovaDevice, $cordovaStatusbar){

  document.addEventListener("deviceready", function () {
    $cordovaStatusbar.overlaysWebView(false); // Always Show Status Bar
    $cordovaStatusbar.styleHex('#E53935'); // Status Bar With Red Color, Using Angular-Material Style
    window.plugins.orientationLock.lock("portrait");
  }, false);
  /* Hijack Android Back Button (You Can Set Different Functions for Each View by Checking the $state.current)
  document.addEventListener("backbutton", function (e) {
      if($state.is('init')){
        navigator.app.exitApp();
      }  else{
        e.preventDefault();
      }
    }, false);*/

  /*$rootScope.$on('$stateChangeStart', function(e, to) {

    //var auth = Authentication;
    //console.log(auth.user.roles[0]);
	if(to.name === 'login') {
		$sessionStorage.userRole = null;
		//shared.setUserRole(null);
	} else if (to.data.userRole === $sessionStorage.userRole) {


    } else {
		e.preventDefault();
		$state.go('login');
	}

  });*/
})

.config(function($mdThemingProvider, $mdGestureProvider) { // Angular-Material Color Theming
  $mdGestureProvider.skipClickHijack();

  $mdThemingProvider.theme('default')
	/*
	.primaryPalette('red')
    .accentPalette('blue');*/

    .primaryPalette('light-blue')
    .accentPalette('grey');
});

angular.element(document).ready(function() {
  angular.bootstrap(document, ['opsDashboard']);
});