(function() {
	"use strict";

	angular.module("opsDashboard").controller("omHomeController", omHomeController);

	omHomeController.$inject = ['shared', '$sessionStorage', '$state', '$filter', '$window', '$mdSidenav', '$mdComponentRegistry', '$timeout', '$interval','myAppFactoryOM', 'dashboardService'];

	function omHomeController (shared, $sessionStorage, $state, $filter, $window, $mdSidenav, $mdComponentRegistry, $timeout, $interval,myAppFactoryOM, dashboardService) {

		var omCtrl = this;

		omCtrl.auth = shared.info.auth;

		omCtrl.userRole = $state.current.data.userRole;

		omCtrl.toggle = angular.noop;

		omCtrl.title = $state.current.title;
		omCtrl.dashboardSummary = {};
		omCtrl.byApp =	[];
		omCtrl.byPerson =	[];
		omCtrl.bySLACompliance =	[];
		omCtrl.bySLAComplianceApp =	[];
		omCtrl.bySLAComplianceTeam =	[];
		omCtrl.byEscalation =	[];
		omCtrl.byTicketCategories =	[];
		omCtrl.ticketCategoryGroups = [
			{ id: "WTDData", label: 'WTD' },
			{ id: "MTDData", label: 'MTD' },
			{ id: "QTDData", label: 'QTD' },
			{ id: "YTDData", label: 'YTD' }
		];
		omCtrl.selectedApp = { id: "WTDData", name: 'WTD'};
		omCtrl.ticketVolumeByApp = { id: "WTDData", name: 'WTD'};
		omCtrl.selectedTeam = { id: "WTDData", name: 'WTD'};
		omCtrl.ticketVoulmeByApp	 = "WTDData";
  

		omCtrl.escalationBYApplicationDataset = [];
		omCtrl.escalationDataset	=	[];
		omCtrl.catData1 = [];
		omCtrl.catData2 = [];
		omCtrl.catData3 = [];

		omCtrl.onSLAComplianceAppChange = function() {
		 updateSLAComplianceApp();
		};

		function updateSLAComplianceApp(){
		omCtrl.bySLAComplianceApp = omCtrl.bySLACompliance['byApp'][omCtrl.selectedApp.id];
		}

		omCtrl.onSLAComplianceTeamChange = function() {
		 updateSLAComplianceTeam();
		};

		function updateSLAComplianceTeam(){
		omCtrl.bySLAComplianceTeam = omCtrl.bySLACompliance['byPerson'][omCtrl.selectedTeam.id];
		}

		// escalation Chart  Priority
		function escalationByPriority(){
		  var escalationData = omCtrl.byEscalation['byPriority'];
		  omCtrl.escalationDatasetData	=	[];
			for (var j = 0; j < escalationData.length; j++) {
				omCtrl.escalationDatasetData.push({label: escalationData[j]['priority'],data: escalationData[j]['escCount']});
			};
			omCtrl.escalationDataset = omCtrl.escalationDatasetData;

			omCtrl.escalationDataset[0].color = shared.color.orange;
			omCtrl.escalationDataset[1].color = shared.color.blue;
			omCtrl.escalationDataset[2].color = shared.color.lime;
		}
		omCtrl.escalationOptions = angular.merge({
			series: {
				pie: {
					show: true,
					radius: 1,
					label: {
						show: true,
						radius: 3/4,
						formatter: function (label, series) {
							return '<div style="font-size:1rem;text-align:center;padding:2px;color:#fff;">'+Math.round(series.percent)+'%</div>';

						}
					},
					highlight: {
						opacity: 0.2
					},
					stroke: {
						color: '#FFF',
						width: 2
					},
				}
			},
			grid: {
				hoverable: true,
				clickable: true
			},
			legend: {
				container: '.escalation-Chart.legend-container'
			}
		}, shared.pieChartCommonOptions);

		// Escalation by Application
		function escalationByApp(){
		  var escalationByAppData =[];
			omCtrl.byEscalation['byApp'].forEach(function(el,i){
				escalationByAppData.push( [i, el.escCount] );
				omCtrl.escalationBYApplicationOptions.xaxis.ticks.push([i, el.appName]);
			});
			omCtrl.escalationBYApplicationDataset[0].data = escalationByAppData;
		}

		omCtrl.escalationBYApplicationDataset = [angular.merge({}, {
			label: 'Applications',
			color: shared.color.darkgray,
			data: [],
		}, shared.categoryChartCommonData)];
		omCtrl.escalationBYApplicationOptions = angular.merge({
			series: {
				bars: {
					show: true,
					lineWidth: 1,
					fill: 1.0,
					fillColor: shared.color.lightgray,
					//fillColor: { colors: [ { opacity: 0.3 }, { brightness: 0.3, opacity: 0.3 } ] },
					//fillColor: '#2196f3',
					barWidth: 0.6,
					align: 'center'
				},
				highlightColor: 'rgba(255, 255, 255, 0.2)'
			},
			legend: {
				container: '.escalationBYApp-Chart.legend-container'
			},
			xaxis:{
					ticks:[]
				}
		}, shared.chartCommonOptions);

		// Ticket Volume By Application

		omCtrl.ticketVolumeByAppChange = function() {
			updateTicketVolume();
		};
		
		function updateTicketVolume(){
			var ticketVolumeId = omCtrl.ticketVolumeByApp.id;
			omCtrl.catData1 = [];
			omCtrl.catData2 = [];
			var groupData = omCtrl.byTicketCategories[ticketVolumeId];
			groupData.forEach(function(el,i){
				omCtrl.catData1.push( [i, el.raisedCount] );
				omCtrl.catData2.push( [i, el.openCount] );
				omCtrl.ticketVolumeOptions.xaxis.ticks.push([i, el.appName]);
			});
			omCtrl.ticketVolumeDataset[0].data = omCtrl.catData1;
			omCtrl.ticketVolumeDataset[1].data = omCtrl.catData2;
		}

		omCtrl.ticketVolumeDataset = [angular.merge({}, shared.categoryChartCommonData, {
			label: 'Raised',
			data: [],
			color: shared.color.blue,
			bars: {
					show: true,
					order: 1,
					fillColor: shared.color.lightblue,
				},
					valueLabels: {
						//show: true,
						xoffset: -20,
						//yoffset: 0
					}
			}),
			angular.merge({}, shared.categoryChartCommonData, {
				label: 'Open',
				data: [],
				color: shared.color.amber,
				bars: {
					show: true,
					order: 2,
					fillColor: shared.color.lightamber,
				},
				 valueLabels: {
					//font: "Roboto Condensed",
					//fontcolor: '#666',
					//fontsize: '12px',
						xoffset: 20
				}
		})];

		omCtrl.ticketVolumeOptions = angular.merge({
			series: {
				bars: {
					show: true,
					lineWidth: 1,
					fill: 1.0,
					barWidth: 0.2,
				},
				shadowSize: 3,
				highlightColor: 'rgba(255, 255, 255, 0.2)'
			},
			xaxis:{
					ticks:[]
				},
			legend: {
				container: '.ticketVolume-Chart.legend-container'
			}
		}, shared.chartCommonOptions);

		activate();
		// at the bottom of your controller
		function activate () {
			angular.element($window).on('resize', onResize);
			dashboardService.getDashboardSummary().then(function(data) {
				omCtrl.dashboardSummary = data;
			});
			// Factory function for facthing data from OM JSON
			myAppFactoryOM.getData().then(function (responseData) {
				omCtrl.byApp 				= responseData.data[0]['openApproachingSLAs']['byApp'];
				omCtrl.byPerson 			= responseData.data[0]['openApproachingSLAs']['byPerson'];
				omCtrl.byEscalation 		= responseData.data[0]['escalations']['all'];
				omCtrl.byTicketCategories 	= responseData.data[0]['ticketVolume'];
				omCtrl.bySLACompliance 		= responseData.data[0]['resolutionSLACompliance'];

				updateSLAComplianceTeam();
				updateSLAComplianceApp();
				updateTicketVolume();
				escalationByPriority();
				escalationByApp();
			});
		}
		
		function onResize () {
			if($window.innerWidth<=479){
				omCtrl.ticketVolumeDataset[0].valueLabels.xoffset =-5;
				omCtrl.ticketVolumeDataset[1].valueLabels.xoffset = 5;
			}else if($window.innerWidth>479&&$window.innerWidth<=768){
				omCtrl.ticketVolumeDataset[0].valueLabels.xoffset =-8;
				omCtrl.ticketVolumeDataset[1].valueLabels.xoffset = 8;
			}else if($window.innerWidth>=768 && $window.innerWidth<=991){
				omCtrl.ticketVolumeDataset[0].valueLabels.xoffset =-15;
				omCtrl.ticketVolumeDataset[1].valueLabels.xoffset = 15;
			}else if($window.innerWidth>991 && $window.innerWidth<=1280){
				omCtrl.ticketVolumeDataset[0].valueLabels.xoffset =-20;
				omCtrl.ticketVolumeDataset[1].valueLabels.xoffset = 20;
			}			
		}
		
		omCtrl.isOpen = function() { return false };

		$mdComponentRegistry
		.when("right")
		.then( function(sideNav){
		  omCtrl.isOpen = angular.bind( sideNav, sideNav.isOpen );
		  omCtrl.toggle = angular.bind( sideNav, sideNav.toggle );
		});

		omCtrl.toggleRight = function() {
		$mdSidenav("right").toggle()
			.then(function(){
			});
		};

		omCtrl.close = function() {
		$mdSidenav("right").close()
			.then(function(){
			});
		};
				
	}
})();
