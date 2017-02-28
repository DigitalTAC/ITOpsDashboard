(function() {
	"use strict";

	angular.module("opsDashboard").service('dashboardService', dashboardService);

	dashboardService.$inject = ['$http', '$state', '$q', 'cooDataFactory'];

	function dashboardService($http, $state, $q, cooDataFactory) {

		this.getDashboardSummary = function() {

			//var userRole = $state.current.data.userRole;
			var userRole = $state.next.data.userRole;

			var url = 'dashboardSummary' + userRole + '.json';
			return $http({
				method: 'GET',
				url: url
			})
			.then(getdashboardSummaryComplete)
			.catch(getDashboardSummaryFailed);

			function getdashboardSummaryComplete(data, status, headers, config) {
				cooDataFactory.data = data.data[0];
				return data.data[0];
			}

			function getDashboardSummaryFailed(e) {
					var newMessage = 'XHR Failed for getDashboardSummary';

					console.log(newMessage);
					return $q.reject(e);
			}

		}
	}
})();