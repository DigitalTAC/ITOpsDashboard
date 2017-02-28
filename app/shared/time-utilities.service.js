(function() {
	"use strict";

	angular.module("opsDashboard").service("timeUtilitiesService", timeUtilitiesService);

	function timeUtilitiesService(){
		this.getQuarter = function (d) {
			d = new Date(d);
			var q = ['Q1' , 'Q2' , 'Q3', 'Q4'];
			return q[Math.floor(d.getMonth() / 3)];
		}

	}

})();