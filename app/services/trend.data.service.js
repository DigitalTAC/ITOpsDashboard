(function() {
	"use strict";

	angular.module("opsDashboard").service('trendDataService', trendDataService);

	trendDataService.$inject = ['$window', '$filter', 'timeUtilitiesService', 'cooDataFactory'];

	function trendDataService($window, $filter, timeUtilitiesService, cooDataFactory) {
		var currentTrendViewData;
		var trendId, dropDown;
		var windowWidth = $window.innerWidth;
		var tickIntervalXAxis = 5;
		var axisLabelOptions = {};

		this.formatData = formatData;
		this.updateData = updateData;
		this.updateXAxis = updateXAxis;

		function formatData () {
			var groupRaisedData = [], groupResolvedData = [];
			groupRaisedData.length = 0;
			groupResolvedData.length = 0;

			if(dropDown === 'trend') {
				currentTrendViewData.forEach(function(el){
					groupRaisedData.push( [el.timeInstance, el.totalRaisedCount] );
					groupResolvedData.push( [el.timeInstance, el.totalResolvedCount] );
				});
			}
			else if(dropDown === 's1S2') {
				currentTrendViewData.forEach(function(el){
					groupRaisedData.push( [el.timeInstance, el.s1.raisedCount] );
					groupResolvedData.push( [el.timeInstance, el.s2.raisedCount] );
				});
			}
			else if(dropDown === 's3S4') {
				currentTrendViewData.forEach(function(el){
					groupRaisedData.push( [el.timeInstance, el.s3.raisedCount] );
					groupResolvedData.push( [el.timeInstance, el.s4.raisedCount] );
				});
			}

			return [{data: groupRaisedData}, {data: groupResolvedData}];

		}
		// tId: daily, weekly etc.
		// dropDown: 'trend', 's1S2', 's3S4' etc
		function updateData (tId, dDown) {
			trendId = tId;
			dropDown = dDown;
			currentTrendViewData = cooDataFactory.data.ticketTrendThisYear[trendId];
		}

		function updateXAxis () {
				if(windowWidth <= 412) {
					tickIntervalXAxis = 6;
				} else {
					tickIntervalXAxis = 5;
				}
				axisLabelOptions.ticks = null;
				if (trendId === "dailyData") {
					axisLabelOptions = {
						max: currentTrendViewData.length,
						ticks: []
					};
					axisLabelOptions.ticks.length = 0;
					for (var i=0; i<currentTrendViewData.length; i+=tickIntervalXAxis) {
						axisLabelOptions.ticks.push([i, $filter('date')((currentTrendViewData[i].timeInstance)*1000, 'dd MMM')]);
					}

					//vm.timeref = $filter('date')((currentTrendViewData[currentTrendViewData.length-1].timeInstance)*1000, 'yyyy');
				}
				else if (trendId === "weeklyData") {

					tickIntervalXAxis = (currentTrendViewData.length > 7) ? 7:1;
					axisLabelOptions = {
						max: currentTrendViewData.length,
						ticks: []
					};
					axisLabelOptions.ticks.length = 0;
					for (var i=0; i<currentTrendViewData.length; i+=tickIntervalXAxis) {
						axisLabelOptions.ticks.push([i, $filter('date')((currentTrendViewData[i].timeInstance)*1000, 'dd MMM')]);
					}
				}
				else if (trendId === "monthlyData"){
					if(windowWidth <= 412) {
						tickIntervalXAxis = 1;
					} else {
						tickIntervalXAxis = 1;
					}


						axisLabelOptions = {
							max: currentTrendViewData.length,
							ticks: []
					}
					axisLabelOptions.ticks.length = 0;
					for (var i=0; i<currentTrendViewData.length; i+=tickIntervalXAxis) {
						axisLabelOptions.ticks.push([i, $filter('date')((currentTrendViewData[i].timeInstance)*1000, 'MMM')]);
					}

				}
				else if (trendId === "quarterlyData") {
					axisLabelOptions = {
						max: 3,
						ticks: []
					};
					tickIntervalXAxis = 1;
					axisLabelOptions.ticks.length = 0;
					for (var i=0; i<currentTrendViewData.length; i+=tickIntervalXAxis) {
						axisLabelOptions.ticks.push([i, timeUtilitiesService.getQuarter((currentTrendViewData[i].timeInstance)*1000)]);
					}
				}

				return axisLabelOptions;
		}
	}
})();