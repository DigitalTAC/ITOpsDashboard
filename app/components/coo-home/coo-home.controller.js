(function() {
	"use strict";

	angular.module("opsDashboard").controller("CooHomeController", CooHomeController);

	CooHomeController.$inject = ['shared', '$sessionStorage', '$state', '$filter', '$window', '$mdSidenav', '$mdComponentRegistry', '$timeout', '$interval', 'cooDataFactory', 'trendDataService', 'categoryDataService', 'dashboardData'];

	function CooHomeController (shared, $sessionStorage, $state, $filter, $window, $mdSidenav, $mdComponentRegistry, $timeout, $interval, cooDataFactory, trendDataService, categoryDataService, dashboardData) {

		var vm = this;

		vm.userRole = $state.current.data.userRole;

		vm.title = $state.current.title;

		vm.dashboardSummary = {};

		vm.selectedTrendGroup = { id: "dailyData", label: 'Daily' };
		vm.selectedS1S2TrendGroup = { id: "dailyData", label: 'Daily' };
		vm.selectedS3S4TrendGroup = { id: "dailyData", label: 'Daily' };
		vm.selectedCategoryGroup = { id: "WTDData", label: 'WTD' };

		vm.ticketTrendGroups = [
			{ id: "dailyData", label: 'Daily' },
			{ id: "weeklyData", label: 'Weekly' },
			{ id: "monthlyData", label: 'Monthly' },
			{ id: "quarterlyData", label: 'Quarterly' }
		];

		vm.ticketCategoryGroups = [
			{ id: "WTDData", label: 'WTD' },
			{ id: "MTDData", label: 'MTD' },
			{ id: "QTDData", label: 'QTD' },
			{ id: "YTDData", label: 'YTD' }
		];

		vm.trendDataset = [	angular.merge({}, {
			label: 'Raised',
			color: shared.color.blue,
			data: [],
			markMinMax: {
				markMax: true
			}
		}, shared.lineChartCommonData), angular.merge({}, {
			label: 'Resolved',
			color: shared.color.lime,
			data: [],
			markMinMax: {
				markMax: true
			}
		}, shared.lineChartCommonData)];
		vm.trendOptions = angular.merge({
			legend: {
				container: '.trend-Chart.legend-container',
			}
		}, shared.chartCommonOptions, shared.lineChartCommonOptions);

		vm.s1S2TrendDataset = [angular.merge({}, {
			label: 'S1',
			color: shared.color.purple,
			data: [],
			markMinMax: {
				markMax: true
			}
		}, shared.lineChartCommonData),
		angular.merge({}, {
			label: 'S2',
			color: shared.color.amber,
			data: [],
			markMinMax: {
				markMax: true
			}
		}, shared.lineChartCommonData)];
		vm.s1S2TrendOptions = angular.merge({
			legend: {
				container: '.s1s2-trend-Chart.legend-container'
			}
		}, shared.chartCommonOptions, shared.lineChartCommonOptions);

		vm.s3S4TrendDataset = [angular.merge({}, {
			label: 'S3',
			color: shared.color.teal,
			data: [],
			markMinMax: {
				markMax: true
			}
		}, shared.lineChartCommonData), angular.merge({}, {
			label: 'S4',
			color: shared.color.yellow,
			data: [],
			markMinMax: {
				markMax: true
			}
		}, shared.lineChartCommonData)];
		vm.s3S4TrendOptions = angular.merge({
			legend: {
				container: '.s3s4-trend-Chart.legend-container'
			}
		}, shared.chartCommonOptions, shared.lineChartCommonOptions);

		vm.categoriesDataset = [angular.merge({},{
			label: 'Category',
			color: shared.color.blue,
			data: [],
			bars: {
				show: true,
				order: 1,
				fillColor: shared.color.lightblue
			}
		}, shared.categoryChartCommonData)];
		
		
		vm.categoriesOptions = angular.merge({
			series: {
				bars: {
					show: true,
					lineWidth: 1,
					fill: 1.0,
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

		vm.onTrendGroupChange = onTrendGroupChange;

		vm.onS1S2TrendGroupChange = onS1S2TrendGroupChange;

		vm.onS3S4TrendGroupChange = onS3S4TrendGroupChange;

		vm.onCategoryGroupChange = onCategoryGroupChange;

		activate();

		function activate() {

			angular.element($window).on('resize', onResize);

			vm.dashboardSummary = dashboardData;

			updateYAxisLabels();
			updateTrendData();

			updateS1S2TrendData();
			updateS3S4TrendData();
			updateCategoryData();

		}

		function onTrendGroupChange() {
			vm.trendDataset[0].data.length = 0;
			vm.trendDataset[1].data.length = 0;

			updateTrendData();
		};

		function onS1S2TrendGroupChange() {
			vm.s1S2TrendDataset[0].data.length = 0;
			vm.s1S2TrendDataset[1].data.length = 0;

			updateS1S2TrendData();
		};

		function onS3S4TrendGroupChange() {
			vm.s3S4TrendDataset[0].data.length = 0;
			vm.s3S4TrendDataset[1].data.length = 0;

			updateS3S4TrendData();
		};

		function onCategoryGroupChange() {
			vm.categoriesDataset[0].data.length = 0;

			updateCategoryData();
		};

		function updateTrendData() {

			var trendId = vm.selectedTrendGroup.id;
			trendDataService.updateData(trendId, 'trend');

			angular.merge(vm.trendDataset, trendDataService.formatData());
			angular.merge(vm.trendOptions.xaxis, trendDataService.updateXAxis());
		}

		function updateS1S2TrendData() {

			var trendId = vm.selectedS1S2TrendGroup.id;
			trendDataService.updateData(trendId, 's1S2');

			angular.merge(vm.s1S2TrendDataset, trendDataService.formatData());
			angular.merge(vm.s1S2TrendOptions.xaxis, trendDataService.updateXAxis());
		}

		function updateS3S4TrendData() {

			var trendId = vm.selectedS3S4TrendGroup.id;
			trendDataService.updateData(trendId, 's3S4');

			angular.merge(vm.s3S4TrendDataset, trendDataService.formatData());
			angular.merge(vm.s3S4TrendOptions.xaxis, trendDataService.updateXAxis());
		}

		function updateCategoryData() {
			var categoryId = vm.selectedCategoryGroup.id;
			categoryDataService.updateData(categoryId, 'WTD');

			angular.merge(vm.categoriesDataset, categoryDataService.formatData());
			angular.merge(vm.categoriesOptions.xaxis, categoryDataService.updateXAxis());
		}

		function updateYAxisLabels() {
			var windowWidth = $window.innerWidth;

			$timeout(function () {

				if(windowWidth <= 412) {

					vm.trendOptions.yaxis.ticks = 2;
					vm.s1S2TrendOptions.yaxis.ticks = 2;
					vm.s3S4TrendOptions.yaxis.ticks = 2;
					vm.categoriesOptions.yaxis.ticks = 2;

				} else {
					vm.trendOptions.yaxis.ticks = 4;
					vm.s1S2TrendOptions.yaxis.ticks = 4;
					vm.s3S4TrendOptions.yaxis.ticks = 4;
					vm.categoriesOptions.yaxis.ticks = 4;
				}

			}, 0);
		}

		var timeoutPromise = false;
		function onResize() {
			if(timeoutPromise !== false) {
				$timeout.cancel(timeoutPromise);
			}
			timeoutPromise = $timeout(function(){
				updateTrendData();
				updateS1S2TrendData();
				updateS3S4TrendData();
				updateCategoryData();
				updateYAxisLabels();
			}, 200);
		};

		/*
		this.isOpen = function() { return false };

		$mdComponentRegistry
		.when("right")
		.then( function(sideNav){
			vm.isOpen = angular.bind( sideNav, sideNav.isOpen );
			vm.toggle = angular.bind( sideNav, sideNav.toggle );
		});
		*/

		this.toggleRight = toggleRight;
		function toggleRight() {
			$mdSidenav("right").toggle()
				.then(function(){
			});
		};
		/*
		this.close = function() {
			$mdSidenav("right").close()
				.then(function(){
			});
		};
		*/

	}
})();