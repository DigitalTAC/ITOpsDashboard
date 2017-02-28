(function() {
	"use strict";

	angular.module("opsDashboard").factory('cooDataFactory', cooDataFactory);

	function cooDataFactory () {
		return {
				data: []
		}
	}
})();