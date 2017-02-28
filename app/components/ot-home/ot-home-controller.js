(function() {
	"use strict";

	angular.module("opsDashboard").controller("otHomeController", otHomeController);

	otHomeController.$inject = ['shared', '$sessionStorage', '$state', '$filter', '$window', '$mdSidenav', '$mdComponentRegistry', '$timeout', '$interval','myAppFactoryOT', 'dashboardService'];

	function otHomeController (shared, $sessionStorage, $state, $filter, $window, $mdSidenav, $mdComponentRegistry, $timeout, $interval,myAppFactoryOT, dashboardService) {
	
		var otCtrl = this;
		otCtrl.auth = shared.info.auth;
		otCtrl.userRole = $state.current.data.userRole;
		otCtrl.toggle = angular.noop;
		otCtrl.title = $state.current.title;
		otCtrl.dashboardSummary = {};
		otCtrl.byMyApprochingSLA =	[];
		otCtrl.bySLACompliance =	[];
		otCtrl.bySLAComplianceApp =	[];
		otCtrl.bySLAComplianceTeam =	[];
		otCtrl.byEscalation =	[];
		otCtrl.byMyEscalation =	[];
		otCtrl.myContribution =	[];
		otCtrl.byTicketCategories =	[];
		otCtrl.ticketCategoryGroups = [
			{ id: "WTDData", label: 'WTD' },
			{ id: "MTDData", label: 'MTD' },
			{ id: "QTDData", label: 'QTD' },
			{ id: "YTDData", label: 'YTD' }
		];
		otCtrl.escalationsList = [
			{ id: "byApp", name: 'Application' },
			{ id: "byPriority", name: 'Priority' }
		];

		otCtrl.eslGroup = { id: "byPriority", name: 'Priority'};
		otCtrl.selectedApp = { id: "WTDData", name: 'WTD'};
		otCtrl.ticketVolumeByApp = { id: "WTDData", name: 'WTD'};
		otCtrl.selectedTeam = { id: "WTDData", name: 'WTD'};
		otCtrl.ticketVoulmeByApp	 = "WTDData";
		otCtrl.myContributionDataset = [];
		otCtrl.escalationDataset = [];
		otCtrl.escalationData = [];
		otCtrl.pieDataset = [];

		otCtrl.onEscalationChange = function() {
		  var chartBy	=	otCtrl.eslGroup.id;
		  if(chartBy =="byPriority"){
			  updateEscalation();
			  $("#byPriority").show();
			  $("#byApp").hide();
			  
		  }else if(chartBy =="byApp"){
			  escalationByApp();
			  $("#byPriority").hide();
			  $("#byApp").show();
		  }
		};
		
		otCtrl.onTicketValumeChange = function() {
			updateTicketVolume();
		};

		otCtrl.onSLAComplianceChange = function() {
			 updateSLACompliance();
		};

		function updateSLACompliance(){
			otCtrl.bySLAComplianceApp = otCtrl.bySLACompliance[otCtrl.selectedApp.id];
		}

	  // Escalation by Application Example

		function updateEscalation(){
		 var chartBy	=	otCtrl.eslGroup.id;
		 otCtrl.escalationData	=	[];
		  var eslData	=	otCtrl.byEscalation[chartBy];
		  for(var i=0;i<eslData.length;i++){
			  if(chartBy =="byPriority"){
				otCtrl.escalationData.push({label: eslData[i]['priority'],data: eslData[i]['escCount']});

			  }
			}
			otCtrl.escalationDataset = otCtrl.escalationData;
			otCtrl.escalationDataset[0].color = shared.color.orange;
			otCtrl.escalationDataset[1].color = shared.color.blue;
			otCtrl.escalationDataset[2].color = shared.color.lime;
		}


		otCtrl.escalationOptions = angular.merge({
			series: {
				pie: {
				  show: true,
				  radius: 1,
				  label: {
					show: true,
					radius: 3/4,
					formatter: function (label, series) {
						return '<div style="font-size:1rem;text-align:center;padding:2px;color:#fff;">'+Math.round(series.percent) + '%</div>';

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

			noColumns: 4,
			container: '.escalations-Chart.legend-container'
			}
		}, shared.pieChartCommonOptions);

	// Escalation by Application
		function escalationByApp(){
		  var escalationByAppData =[];
			otCtrl.byEscalation['byApp'].forEach(function(el,i){
				escalationByAppData.push( [i, el.escCount] );
				otCtrl.escalationBYApplicationOptions.xaxis.ticks.push([i, el.appName]);
			});
			otCtrl.escalationBYApplicationDataset[0].data = escalationByAppData;
		}

		otCtrl.escalationBYApplicationDataset = [angular.merge({
			label: 'Applications',
			color: shared.color.darkgray,
			data: [],
			/*
			valueLabels: {
				font: "Roboto Condensed",
				fontcolor: '#666',
				fontsize: '12px',
				show: true,
				xoffset: 0,
				yoffset: 0
			}*/
		}, shared.categoryChartCommonData)];
		otCtrl.escalationBYApplicationOptions = angular.merge({
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
				container: '.escalations-Chart.legend-container'
			},
			xaxis:{
					ticks:[]
				}
		}, shared.chartCommonOptions);

		// End
		otCtrl.onCategoryGroupChange = function() {
			updateTicketVolum();
		};

		function updateTicketVolume(){
			var ticketVolumeId = otCtrl.ticketVolumeByApp.id;
			otCtrl.catData1 = [];
			otCtrl.catData2 = [];
			var groupData = otCtrl.byTicketCategories[ticketVolumeId];
			groupData.forEach(function(el,i){
				otCtrl.catData1.push( [i, el.raisedCount] );
				otCtrl.catData2.push( [i, el.openCount] );
				otCtrl.ticketVolumeOptions.xaxis.ticks.push([i, el.appName]);
			});
			otCtrl.ticketVolumeDataset[0].data = otCtrl.catData1;
			otCtrl.ticketVolumeDataset[1].data = otCtrl.catData2;
		}

	  // Ticket Voulme By Application
		otCtrl.ticketVolumeDataset = [angular.merge({}, shared.categoryChartCommonData, {
				label: 'Raised',
				data: [],
				color: shared.color.blue,
				bars: {
					show: true,
					order: 1,
					fillColor: shared.color.lightblue
				},
				valueLabels: {
					xoffset: -20
				}
			}),
			angular.merge({}, shared.categoryChartCommonData, {
				label: 'Open',
				data: [],
				color: shared.color.amber,
				bars: {
						show: true,
						order: 2,
						fillColor: shared.color.lightamber
					},
					valueLabels: {
						//font: "Roboto Condensed",
						//fontcolor: '#666',
						//fontsize: '12px',
						xoffset: 20,
						//yoffset: 0,
						//show: true
					}
			})
		];

		otCtrl.ticketVolumeOptions = angular.merge({
			series: {
				bars: {
					show: true,
					lineWidth: 1,
					fill: 1.0,
					barWidth: 0.2
				},
				highlightColor: 'rgba(255, 255, 255, 0.2)'
			},
			xaxis: {
				ticks: []
			},
			legend: {
				container: '.ticketVolume-Chart.legend-container'
			}
		}, shared.chartCommonOptions);

	// MyContribution Functions
	  otCtrl.onMyContributionChange= function(){
		  updateMyContribution();
	  }
	  function updateMyContribution(){
		  var dataId 	= otCtrl.selectedTeam.id;
		 otCtrl.myContributionData	=	[];
		  var myData	=	otCtrl.myContribution[dataId];
		  for(var i=0;i<myData.length;i++){
				  if( myData[i]['label']=='Me'){
					otCtrl.myContributionData.push({label: myData[i]['label'],data: myData[i]['myResolvedCount']});
				  }else if(myData[i]['label']=='Team'){
					otCtrl.myContributionData.push({label: myData[i]['label'],data: myData[i]['teamResolvedCount']});
				  }
			}
			otCtrl.myContributionDataset = otCtrl.myContributionData;
			otCtrl.myContributionDataset[0].color = shared.color.lime;
			otCtrl.myContributionDataset[1].color = shared.color.green;
	  }

	  //myContributionOptions;
	  var containerLabel	=" Resolved by :";
	  otCtrl.myContributionOptions = angular.merge({
	   series: {
			pie: {
			  show: true,
			  radius: 1,
			  label: {
				show: true,
				radius: 3/4,
				formatter: function (label, series) {

					if (label == 'Me'){
					   //show your read messages
					   return '<div style="font-size:150%;position:relative;top:5px;left:4px;color:#fff;">'+Math.round(series.percent)+'%</div>';
					} else {
					   return '<div style="font-size:150%;;position:relative;top:-30px;left:0;color:#fff;">'+Math.round(series.percent)+'%</div>';
					}

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
				container: '.myContribution-Chart.legend-container'
			}
		}, shared.pieChartCommonOptions);

		activate();	
	  // at the bottom of your controller
		function activate() {
			angular.element($window).on('resize', onResize);
			dashboardService.getDashboardSummary().then(function(data) {
				otCtrl.dashboardSummary = data;
			});

			myAppFactoryOT.getData().then(function (responseData) {

				otCtrl.byApp 				= responseData.data[0]['openApproachingSLAs']['all']['byApp'];
				otCtrl.byMyApprochingSLA	= responseData.data[0]['openApproachingSLAs']['my']['byApp'];
				otCtrl.byEscalation	 		= responseData.data[0]['escalations']['all'];
				otCtrl.byMyEscalation	 	= responseData.data[0]['escalations']['my']['byApp'];
				otCtrl.byTicketCategories	= responseData.data[0]['ticketVolume'];
				otCtrl.bySLACompliance 		= responseData.data[0]['myResolutionSLACompliance'];
				otCtrl.myContribution 		= responseData.data[0]['myResolutionContribution'];

				updateEscalation();
				updateMyContribution();
				updateTicketVolume();
				updateSLACompliance();
				//escalationByApp();
				setTimeout(function(){
					$('div.myContribution-Chart').find('table > tbody').html('<tr><td>Resolved by</td><td class="legendColorBox"><div style="border:1px solid transparent;padding:1px"><div style="width:4px;height:0;border:5px solid #43A047;overflow:hidden"></div></div></td><td class="legendLabel">Me</td><td class="legendColorBox"><div style="border:1px solid transparent;padding:1px"><div style="width:4px;height:0;border:5px solid #AEEA00;overflow:hidden"></div></div></td><td class="legendLabel">Team</td></tr>')
				},500);
				
			});
		}
		
		function onResize() {
			if($window.innerWidth<=479){
				otCtrl.ticketVolumeDataset[0].valueLabels.xoffset =-5;
				otCtrl.ticketVolumeDataset[1].valueLabels.xoffset = 5;
			}else if($window.innerWidth>479&&$window.innerWidth<=768){
				otCtrl.ticketVolumeDataset[0].valueLabels.xoffset =-8;
				otCtrl.ticketVolumeDataset[1].valueLabels.xoffset = 8;
			}else if($window.innerWidth>=768 && $window.innerWidth<=991){
				otCtrl.ticketVolumeDataset[0].valueLabels.xoffset =-15;
				otCtrl.ticketVolumeDataset[1].valueLabels.xoffset = 15;
			}else if($window.innerWidth>991 && $window.innerWidth<=1280){
				otCtrl.ticketVolumeDataset[0].valueLabels.xoffset =-20;
				otCtrl.ticketVolumeDataset[1].valueLabels.xoffset = 20;
			}	
		}
		
		this.toggleRight = toggleRight;
		function toggleRight() {
			$mdSidenav("right").toggle()
				.then(function(){
			});
		};

	}
})();