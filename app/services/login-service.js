"use strict";

angular.module("opsDashboard").service('loginService', function($http,shared ) {

	this.getloginData = function() {
		var url = 'login.json'
		return $http({
			method: 'GET',
			url: url
		});

	}
});
