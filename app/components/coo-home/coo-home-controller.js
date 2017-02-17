"use strict";

angular.module("opsDashboard").controller("cooHomeController", function(shared, $sessionStorage, $state, $filter, $scope, $window, $mdSidenav, $mdComponentRegistry, $timeout, $interval, dashboardService){

    var ctrl = this;

    this.auth = shared.info.auth;

    this.userRole = $state.current.data.userRole;

    this.toggle = angular.noop;
    this.title = $state.current.title;

    this.isOpen = function() { return false };
    $mdComponentRegistry
    .when("right")
    .then( function(sideNav){
      ctrl.isOpen = angular.bind( sideNav, sideNav.isOpen );
      ctrl.toggle = angular.bind( sideNav, sideNav.toggle );
    });

    this.toggleRight = function() {
    $mdSidenav("right").toggle()
        .then(function(){
        });
    };

    this.close = function() {
    $mdSidenav("right").close()
        .then(function(){
        });
    };

	this.dashboardSummary = {
		raisedTodayCount: 0,
		solvedTodayCount: 0,
		escalationsCount: 0,
		openCount: {
			openS1Count: 0,
			openS2Count: 0,
			openS3Count: 0,
			openS4Count: 0,
			openTotalCount: 0
		},
		ticketCategoriesThisYear: 0,
		ticketTrendThisYear: 0
	};

	this.selectedTrendGroup = { id: "dailyData", label: 'Daily' };
	this.selectedS1S2TrendGroup = { id: "dailyData", label: 'Daily' };
	this.selectedS3S4TrendGroup = { id: "dailyData", label: 'Daily' };
	this.ticketTrendGroups = [
		{ id: "dailyData", label: 'Daily' },
		{ id: "weeklyData", label: 'Weekly' },
		{ id: "monthlyData", label: 'Monthly' },
		{ id: "quarterlyData", label: 'Quarterly' }
	];

	$scope.trendDataset = [	angular.merge({}, {
		label: 'Raised',
		color: shared.color.blue,
		data: [],
	}, shared.lineChartCommonData), angular.merge({}, {
		label: 'Resolved',
		color: shared.color.lime,
		data: []
	}, shared.lineChartCommonData)];

	$scope.trendOptions = angular.merge({
		legend: {
			container: '.trend-Chart.legend-container',
		}
	}, shared.chartCommonOptions, shared.lineChartCommonOptions);

	$scope.s1S2TrendDataset = [angular.merge({}, {
		label: 'S1',
		color: shared.color.purple,
		data: []
	}, shared.lineChartCommonData),
	angular.merge({}, {
		label: 'S2',
		color: shared.color.amber,
		data: []
	}, shared.lineChartCommonData)];

	$scope.s1S2TrendOptions = angular.merge({
		legend: {
			container: '.s1s2-trend-Chart.legend-container'
		}
	}, shared.chartCommonOptions, shared.lineChartCommonOptions);

	$scope.s3S4TrendDataset = [angular.merge({}, {
		label: 'S3',
		color: shared.color.teal,
		data: []
	}, shared.lineChartCommonData), angular.merge({}, {
		label: 'S4',
		color: shared.color.yellow,
		data: []
	}, shared.lineChartCommonData)];

	$scope.s3S4TrendOptions = angular.merge({
		legend: {
			container: '.s3s4-trend-Chart.legend-container'
		}
	}, shared.chartCommonOptions, shared.lineChartCommonOptions);

	this.selectedCategoryGroup = { id: "WTDData", label: 'WTD' };
	this.ticketCategoryGroups = [
		{ id: "WTDData", label: 'WTD' },
		{ id: "MTDData", label: 'MTD' },
		{ id: "QTDData", label: 'QTD' },
		{ id: "YTDData", label: 'YTD' }
	];

	$scope.categoriesDataset = [{
		label: 'Category',
		color: shared.color.blue,
		data: [],
		bars: {
			show: true,
			order: 1,
			fillColor: shared.color.lightblue
		},
		valueLabels: {
			show: true,
			xoffset: 0,
			yoffset: 0,
			font: "0.8rem 'Roboto Condensed'",
			fontcolor: '#666'
		}
	}];

	$scope.categoriesOptions = angular.merge({
		series: {
			bars: {
				show: true,
				lineWidth: 1,
				fill: 1.0,
				//fillColor: { colors: [ { opacity: 0.3 }, { brightness: 0.3, opacity: 0.3 } ] },
				//fillColor: '#2196f3',
				barWidth: 0.6,
				align: 'center'
			},
			highlightColor: 'rgba(255, 255, 255, 0.2)'
		},
		xaxis: {
			ticks: [],
			min: -0.5
		},
		legend: {
			container: '.category-Chart.legend-container'
		}
	}, shared.chartCommonOptions);

	$scope.onTrendGroupChange = function() {
		updateTrendData();
		//updateYAxisLabels();
    };

	$scope.onS1S2TrendGroupChange = function() {
		updateS1S2TrendData();
    };

	$scope.onS3S4TrendGroupChange = function() {
		updateS3S4TrendData();
    };

	$scope.onCategoryGroupChange = function() {
		updateCategoryData();
    };

	function updateTrendData() {
		var trendId = ctrl.selectedTrendGroup.id;
		var groupData = ctrl.dashboardSummary.ticketTrendThisYear[trendId];
		var groupRaisedData = [], groupResolvedData = [];

		groupData.forEach(function(el){
			groupRaisedData.push( [el.timeInstance, el.totalRaisedCount] );
			groupResolvedData.push( [el.timeInstance, el.totalResolvedCount] );
		});
		$scope.trendDataset[0].data = groupRaisedData;
		$scope.trendDataset[1].data = groupResolvedData;

		updateXAxisLabels(trendId, 'trend');
    }

	/*
	function updateTrendData() {
		var trendId = ctrl.selectedTrendGroup.id;
		var groupData = ctrl.dashboardSummary.ticketTrendThisYear[trendId];
		var groupRaisedData = [], groupResolvedData = [];

		var groupDataLength = groupData.length;
		var j=0;
		function update() {
			groupRaisedData.length = 0;
			groupResolvedData.length = 0;

			for (var i=0; i<j; i++) {
				groupRaisedData.push( [groupData[i].timeInstance, groupData[i].totalRaisedCount] );
				groupResolvedData.push([groupData[i].timeInstance, groupData[i].totalResolvedCount] );
			}

			$scope.trendDataset[0].data = groupRaisedData;
			$scope.trendDataset[1].data = groupResolvedData;

			j += 1;
			if (j > groupDataLength) {
				$interval.cancel(intervalTrendPromise);
			}

		}
		updateXAxisLabels(trendId, 'trend');
		var intervalTrendPromise = $interval(update, shared.animationDelay);

    }
    */

	function updateS1S2TrendData() {
		var trendId = ctrl.selectedS1S2TrendGroup.id;
		var groupData = ctrl.dashboardSummary.ticketTrendThisYear[trendId];
		var s1Data = [], s2Data = [];

		groupData.forEach(function(el){
			s1Data.push( [el.timeInstance, el.s1.raisedCount] );
			s2Data.push( [el.timeInstance, el.s2.raisedCount] );
		});
		$scope.s1S2TrendDataset[0].data = s1Data;
		$scope.s1S2TrendDataset[1].data = s2Data;

		updateXAxisLabels(trendId, 's1S2');
    }

/*
	function updateS1S2TrendData() {
		var trendId = ctrl.selectedS1S2TrendGroup.id;
		var groupData = ctrl.dashboardSummary.ticketTrendThisYear[trendId];
		var s1Data = [], s2Data = [];

		var groupDataLength = groupData.length;
		var j=0;
		function s1S2update() {
			s1Data.length = 0;
			s2Data.length = 0;

			for (var i=0; i<j; i++) {
				s1Data.push( [groupData[i].timeInstance, groupData[i].s1.raisedCount] );
				s2Data.push([groupData[i].timeInstance, groupData[i].s2.raisedCount] );
			}

			$scope.s1S2TrendDataset[0].data = s1Data;
			$scope.s1S2TrendDataset[1].data = s2Data;

			j++;
			if (j > groupDataLength) {
				$interval.cancel(intervalS1S2TrendPromise);
			}

		}

		updateXAxisLabels(trendId, 's1S2');
		var intervalS1S2TrendPromise = $interval(s1S2update, shared.animationDelay);
    }
*/

	function updateS3S4TrendData() {
		var trendId = ctrl.selectedS3S4TrendGroup.id;
		var groupData = ctrl.dashboardSummary.ticketTrendThisYear[trendId];
		var s3Data = [], s4Data = [];

		groupData.forEach(function(el){
			s3Data.push( [el.timeInstance, el.s3.raisedCount] );
			s4Data.push( [el.timeInstance, el.s4.raisedCount] );
		});
		$scope.s3S4TrendDataset[0].data = s3Data;
		$scope.s3S4TrendDataset[1].data = s4Data;

		updateXAxisLabels(trendId, 's3S4');
    }
/*
	function updateS3S4TrendData() {
		var trendId = ctrl.selectedS3S4TrendGroup.id;
		var groupData = ctrl.dashboardSummary.ticketTrendThisYear[trendId];
		var s3Data = [], s4Data = [];

		var groupDataLength = groupData.length;
		var j=0;
		function s3S4update() {
			s3Data.length = 0;
			s4Data.length = 0;

			for (var i=0; i<j; i++) {
				s3Data.push( [groupData[i].timeInstance, groupData[i].s3.raisedCount] );
				s4Data.push([groupData[i].timeInstance, groupData[i].s4.raisedCount] );
			}

			$scope.s3S4TrendDataset[0].data = s3Data;
			$scope.s3S4TrendDataset[1].data = s4Data;

			j++;
			if (j > groupDataLength) {
				$interval.cancel(intervalS3S4TrendPromise);
			}
		}

		updateXAxisLabels(trendId, 's3S4');
		var intervalS3S4TrendPromise = $interval(s3S4update, shared.animationDelay);
    }
    */

	function updateCategoryData() {
		var categoryId = ctrl.selectedCategoryGroup.id;
		var rawCategoryData = ctrl.dashboardSummary.ticketCategoriesThisYear[categoryId];
		var groupData = [];

		var maxCatValue = Math.max.apply(Math, rawCategoryData.map(function(o){return o.ticketCount;}))
		console.log('Max category value: '+ maxCatValue);
		$scope.categoriesOptions.xaxis.ticks.length = 0;
		$scope.categoriesOptions.yaxis.max = maxCatValue+30;

		rawCategoryData.forEach(function(el, i){

			groupData.push( [i, el.ticketCount] );
			$scope.categoriesOptions.xaxis.ticks.push([i, el.ticketcategory]);
		});


		$scope.categoriesDataset[0].data = groupData;
		/*
		var categoryData = [];
		var groupDataLength = groupData.length;
		var j=0;

		function categoryUpdate() {
			categoryData.length = 0;

			for (var i=0; i<groupDataLength; i++) {
				if(j >= groupData[i][1]) {
					categoryData.push( [i, groupData[i][1]] );

				} else {
					categoryData.push( [i, j] );
				}
			}

			$scope.categoriesDataset[0].data = categoryData;

			j += 10;
			if (j > maxCatValue) {
				$interval.cancel(intervalCategoryPromise);
			}
		}

		var intervalCategoryPromise = $interval(categoryUpdate, shared.animationDelay);
		*/
    }

	function updateXAxisLabels (trendId, dropdown) {

		function getQuarter(d) {
			d = new Date(d); // If no date supplied, use today
			var q = ['Q1' , 'Q2' , 'Q3', 'Q4'];
			return q[Math.floor(d.getMonth() / 3)];
		}

		var windowWidth = $window.innerWidth;
		var axisLabelOptions = {};

		var trendId = ctrl.selectedTrendGroup.id;
		var groupData = ctrl.dashboardSummary.ticketTrendThisYear[trendId];
		var tickIntervalXAxis = 5;

		if(windowWidth <= 412) {
			tickIntervalXAxis = 6;
		}

		if (trendId === "dailyData") {
			axisLabelOptions = {
				max: groupData.length,
				ticks: []
			};
			axisLabelOptions.ticks.length = 0;
			for (var i=0; i<groupData.length; i+=tickIntervalXAxis) {
				axisLabelOptions.ticks.push([i, $filter('date')((groupData[i].timeInstance)*1000, 'dd MMM')]);
			}

			ctrl.timeref = $filter('date')((groupData[groupData.length-1].timeInstance)*1000, 'yyyy');
		} else if (trendId === "weeklyData"){

			tickIntervalXAxis = 1;
			axisLabelOptions = {
				max: groupData.length,
				ticks: []
			};
			axisLabelOptions.ticks.length = 0;
			for (var i=0; i<groupData.length; i+=tickIntervalXAxis) {
				axisLabelOptions.ticks.push([i, $filter('date')((groupData[i].timeInstance)*1000, 'dd MMM')]);
			}
		} else if (trendId === "monthlyData"){
			if(windowWidth <= 412) {
				tickIntervalXAxis = 1;
			} else {
				tickIntervalXAxis = 1;
			}


				axisLabelOptions = {
					max: groupData.length,
					ticks: []
			}
			axisLabelOptions.ticks.length = 0;
			for (var i=0; i<groupData.length; i+=tickIntervalXAxis) {
				axisLabelOptions.ticks.push([i, $filter('date')((groupData[i].timeInstance)*1000, 'MMM')]);
			}

		} else if (trendId === "quarterlyData"){
			axisLabelOptions = {
				max: 3,
				ticks: []
			};
			tickIntervalXAxis = 1;
			axisLabelOptions.ticks.length = 0;
			for (var i=0; i<groupData.length; i+=tickIntervalXAxis) {
				axisLabelOptions.ticks.push([i, getQuarter((groupData[i].timeInstance)*1000)]);
			}
		}

		if (dropdown === 'trend') {
			$scope.trendOptions.xaxis.ticks = null;
			angular.merge($scope.trendOptions.xaxis, axisLabelOptions);
		} else if (dropdown === 's1S2') {
			$scope.s1S2TrendOptions.xaxis.ticks = null;
			angular.merge($scope.s1S2TrendOptions.xaxis, axisLabelOptions);
		} else if (dropdown === 's3S4') {
			$scope.s3S4TrendOptions.xaxis.ticks = null;
			angular.merge($scope.s3S4TrendOptions.xaxis, axisLabelOptions);
		}

	}

	function updateYAxisLabels() {
		var windowWidth = $window.innerWidth;

		$timeout(function () {
			var yAxisOptions = $scope.trendOptions.yaxis;

			if(windowWidth <= 412) {
				yAxisOptions.ticks = 3;
				yAxisOptions.min = 0;

			} else {
				yAxisOptions.ticks = 4;
			}

			$scope.trendOptions.yaxis = yAxisOptions;
			$scope.s1S2TrendOptions.yaxis = yAxisOptions;
			$scope.s3S4TrendOptions.yaxis = yAxisOptions;
			//$scope.categoriesOptions.yaxis = yAxisOptions;

		}, 0);
	}

	var TO = false;
	var onResize = function() {
		if(TO !== false) {
			clearTimeout(TO);
		}
		TO = setTimeout(function(){
			updateTrendData();
			updateS1S2TrendData();
			updateS3S4TrendData();
			updateCategoryData();
			updateYAxisLabels();
		}, 200); //200 miliseconds
	};

	angular.element($window).on('resize', onResize);

	function init() {
		dashboardService.getDashboardSummary().success(function(data) {

			$timeout(function () {

				ctrl.dashboardSummary = data[0];
				updateYAxisLabels();
				updateTrendData();
				updateS1S2TrendData();
				updateS3S4TrendData();
				updateCategoryData();

			}, 0);
        }).error(function(data) {
			 //$scope.messages = data;
			 console.log(data);
        });
	}
	init();

/*
	//
	// Event example
	//

	$scope.eventDataset = angular.copy($scope.categoriesDataset);
	$scope.eventOptions = angular.copy($scope.categoriesOptions);
	$scope.eventOptions.grid = {
		clickable: true,
		hoverable: true
	};

	$scope.onEventExampleClicked = function (event, pos, item) {
		alert('Click! ' + event.timeStamp + ' ' + pos.pageX + ' ' + pos.pageY);
	};

	$scope.onEventExampleHover = function (event, pos, item) {
		console.log('Hover! ' + event.timeStamp + ' ' + pos.pageX + ' ' + pos.pageY);
	};
*/
});
