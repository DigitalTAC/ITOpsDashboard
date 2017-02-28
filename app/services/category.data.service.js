(function() {
	"use strict";

	angular.module("opsDashboard").service('categoryDataService', categoryDataService);

	categoryDataService.$inject = ['$window', 'cooDataFactory'];

	function categoryDataService($window, cooDataFactory) {
		var currentCategoryViewData;
		var categoryId;
		var processedData = [];
		var windowWidth = $window.innerWidth;
		var axisLabelOptions = {
			ticks: []
		};

		this.formatData = formatData;
		this.updateData = updateData;
		this.updateXAxis = updateXAxis;

		function formatData() {

			processedData.length = 0;

			currentCategoryViewData.forEach(function(el, i){
				processedData.push( [i, el.ticketCount] );
			});

			return [{data: processedData}];

		}

		// tId: WTD, MTD etc.
		// dDown: 'category' always
		function updateData (catId, dDown) {
			categoryId = catId;

			currentCategoryViewData = cooDataFactory.data.ticketCategoriesThisYear[categoryId];
		}

		function updateXAxis () {


			var maxCatValue = Math.max.apply(Math, currentCategoryViewData.map(function(o){return o.ticketCount;}))

			axisLabelOptions.ticks.length = 0;

			currentCategoryViewData.forEach(function(el, i){

				axisLabelOptions.ticks.push([i, el.ticketcategory]);
			});

			return axisLabelOptions;
		}
	}
})();