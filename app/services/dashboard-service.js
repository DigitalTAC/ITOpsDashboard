"use strict";

angular.module("opsDashboard").service('dashboardService', function($http, $state ) {

	this.getDashboardSummary = function() {


		var userRole = $state.current.data.userRole;

		var url = 'dashboardSummary' + userRole + '.json'
		return $http({
			method: 'GET',
			url: url
		});

	}
});
