(function() {
	"use strict";

	angular.module("opsDashboard").service("shared", shared);

	function shared(){

		this.info = {
				title: "cordova-angular-angularMaterial-seed",
				auth: "Mario Aleo"
		};

		this.animationDelay = 0;

		this.color = {
			red: '#e53935',
			violet: '#9c27b0',
			pink: '#D81B60',
			purple: '#8E24AA',
			indigo: '#3f51b5',
			blue: '#1E88E5',
			lightblue: '#90CAF9',
			teal: '#26a69a',
			green: '#43A047',
			lightgreen: '#A5D6A7',
			lime: '#AEEA00',
			lightlime: '#DCE775',
			yellow: '#FBC02D',
			amber: '#FF6F00',
			lightamber: '#FFE082',
			orange: '#FF8A65',
			deeporange: '#F4511E',
			lightgray: '#E0E0E0',
			darkgray: '#757575'
		};

		this.lineChartCommonData = {
			points: { show: true, symbol: "circle", fill: true, fillColor: null },
			clickable: true,
			hoverable: true,
			shadowSize: 3,
			highlightColor: null
		};
		
		this.categoryChartCommonData = {
			valueLabels: {
				show: true,
				showMaxValue: false,
				showMinValue: false,
				xoffset: 0,
				yoffset: 0,
				/*font: "0.8rem 'Roboto Condensed'",*/
				font: "12px 'Roboto Condensed'",
				fontcolor: '#666'
			}
		};

		this.chartFontOptions = {
			size: 12,
			lineHeight: 13,
			style: "normal",
			weight: "normal",
			family: "Roboto Condensed",
			//variant: "small-caps",
			color: "#666"
		};

		this.gridColor = '#eee';

		this.chartCommonOptions = {
			debug: 2,
			legend: {
				show: true,
				labelBoxBorderColor: 'transparent',
				noColumns: 2,
				margin: ['2px', '5px'],
				backgroundColor: 'green',
				backgroundOpacity: 1,
				sorted: false
			},
			xaxis: {
				mode: 'categories',
				//mode: "time",
				//tickLength: 0,
				color: this.gridColor,
				font: this.chartFontOptions,
				tickDecimals: 0
			},
			yaxis: {
				//tickLength: 0,
				color: this.gridColor,
				ticks: 5,
				min: 0,
				max: null,
				tickDecimals: 0,
				font: this.chartFontOptions
			},
			tooltip: {
				show: true,
				content: '<div><span class="tool-tip-font-size">%s: %y</span></div>',
				shifts: {
					x: 10,
					y: 20
				},
				defaultTheme: false
			},
			grid: {
				color: '#666', /* legend */
				tickColor: '#ddd',
				//backgroundColor: { colors: [ "#fff", "#eff" ] },
				borderWidth: {
					top: 0,
					right: 0,
					bottom: 1,
					left: 0
				},
				borderColor: {
					top: null, //this.gridColor,
					right: null, //this.gridColor,
					bottom: '#bbb',
					left: null
				},
				clickable: true,
				hoverable: true,
				autoHighlight: true,
				mouseActiveRadius: 50,
				markingsStyle: 'dashed'
			}
		};

		this.lineChartCommonOptions = {
			xaxis: {
				ticks: 12,
				min: -1,
				//autoscaleMargin: 0.05
			},
			series: {
				lines: {
					show: true,
					lineWidth: 2, // in pixels
					fill: false,
					fillColor: null
				},
				points: {
					show: true,
					radius: 2,
					lineWidth: 1, // in pixels
					fill: true,
					fillColor: null,
					symbol: "circle" // or callback
				}
			}
		};

		this.pieChartCommonOptions = {

			legend: {
				show: true,
				labelBoxBorderColor: 'transparent',
				noColumns: 4,
				margin: ['2px', '5px'],
				backgroundColor: 'green',
				backgroundOpacity: 1,
				sorted: false
			}
		};
	}

})();