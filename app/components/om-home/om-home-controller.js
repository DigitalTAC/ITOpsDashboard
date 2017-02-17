"use strict";

angular.module("opsDashboard").controller("omHomeController", function(myAppFactoryOM,shared, $state, $scope, $mdSidenav,$window, $mdComponentRegistry,dashboardService){

    var ctrl = this;

    this.auth = shared.info.auth;

    this.userRole = $state.current.data.userRole;

    this.toggle = angular.noop;

    this.title = $state.current.title;
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
	this.byApp =	[];
	this.byPerson =	[];
	this.bySLACompliance =	[];
	this.bySLAComplianceApp =	[];
	this.bySLAComplianceTeam =	[];
	this.byEscalation =	[];
	this.byTicketCategories =	[];
	this.ticketCategoryGroups = [
		{ id: "WTDData", label: 'WTD' },
		{ id: "MTDData", label: 'MTD' },
		{ id: "QTDData", label: 'QTD' },
		{ id: "YTDData", label: 'YTD' }
	];
  this.selectedApp = { id: "WTDData", name: 'WTD'};
  this.ticketVolumeByApp = { id: "WTDData", name: 'WTD'};
  this.selectedTeam = { id: "WTDData", name: 'WTD'};
  this.ticketVoulmeByApp	 = "WTDData";
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

	 $scope.escalationBYApplicationDataset = [];
	 $scope.escalationDataset	=	[];
	 $scope.catData1 = [];
	 $scope.catData2 = [];
	 $scope.catData3 = [];

	$scope.onSLAComplianceAppChange = function() {
		 updateSLAComplianceApp();
    };

	function updateSLAComplianceApp(){
		ctrl.bySLAComplianceApp = ctrl.bySLACompliance['byApp'][ctrl.selectedApp.id];
	}

	$scope.onSLAComplianceTeamChange = function() {
		 updateSLAComplianceTeam();
    };

	function updateSLAComplianceTeam(){
		ctrl.bySLAComplianceTeam = ctrl.bySLACompliance['byPerson'][ctrl.selectedTeam.id];
	}



	// escalation Chart  Priority
	function escalationByPriority(){
	  var escalationData = ctrl.byEscalation['byPriority'];
	  $scope.escalationDatasetData	=	[];
		for (var j = 0; j < escalationData.length; j++) {
			$scope.escalationDatasetData.push({label: escalationData[j]['priority'],data: escalationData[j]['escCount']});
		};
		$scope.escalationDataset = $scope.escalationDatasetData;

		$scope.escalationDataset[0].color = shared.color.orange;
		$scope.escalationDataset[1].color = shared.color.blue;
		$scope.escalationDataset[2].color = shared.color.lime;
	}
	$scope.escalationOptions = angular.merge({
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
		ctrl.byEscalation['byApp'].forEach(function(el,i){
			escalationByAppData.push( [i, el.escCount] );
			$scope.escalationBYApplicationOptions.xaxis.ticks.push([i, el.appName]);
		});
		$scope.escalationBYApplicationDataset[0].data = escalationByAppData;
	}

	$scope.escalationBYApplicationDataset = [{
		label: 'Applications',
		color: shared.color.darkgray,
		data: [],
		valueLabels: {
			font: "Roboto Condensed",
			fontcolor: '#666',
			fontsize: '12px',
			show: true,
			xoffset: 0,
			yoffset: 0
		}
	}];
  $scope.escalationBYApplicationOptions = angular.merge({
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

   $scope.ticketVolumeByAppChange = function() {
		updateTicketVolume();
    };
  function updateTicketVolume(){
		var ticketVolumeId = ctrl.ticketVolumeByApp.id;
		$scope.catData1 = [];
		$scope.catData2 = [];
		var groupData = ctrl.byTicketCategories[ticketVolumeId];
		groupData.forEach(function(el,i){
			$scope.catData1.push( [i, el.raisedCount] );
			$scope.catData2.push( [i, el.openCount] );
			$scope.ticketVolumeOptions.xaxis.ticks.push([i, el.appName]);
		});
		$scope.ticketVolumeDataset[0].data = $scope.catData1;
		$scope.ticketVolumeDataset[1].data = $scope.catData2;
	}


var x1,x2 ;
  x1=-25;
  x2=25; 
	$scope.ticketVolumeDataset = [{
		label: 'Raised',
		data: [],
		color: shared.color.blue,
		bars: {
				show: true,
				order: 1,
				fillColor: shared.color.lightblue,
			},
				valueLabels: {
					show: true,
					xoffset: x1,
					yoffset: 0
				}
		},
		{
		label: 'Open',
		data: [],
		color: shared.color.amber,
		bars: {
			show: true,
			order: 2,
			fillColor: shared.color.lightamber,
		},
		 valueLabels: {
			 font: "Roboto Condensed",
			fontcolor: '#666',
			fontsize: '12px',
                xoffset: x2,
				yoffset: 0,
                show: true
        }
	}];

	$scope.ticketVolumeOptions = angular.merge({
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


var TO = false;
	var onResize = function() {
		
		if(TO !== false) {
			clearTimeout(TO);
		}
		TO = setTimeout(function(){
			$scope.ticketVolumeDataset[0].valueLabels.xoffset =-10;
			$scope.ticketVolumeDataset[1].valueLabels.xoffset = 10;
			console.log(1111);
		}, 200); //200 miliseconds
	};
	
	angular.element($window).on('resize', onResize);
  // at the bottom of your controller
	var init = function () {
		dashboardService.getDashboardSummary().success(function(data) {
			ctrl.dashboardSummary = data[0];
        }).error(function(data) {
			 //$scope.messages = data;
        });
		// Factory function for facthing data from OM JSON
		myAppFactoryOM.getData().then(function (responseData) {
			ctrl.byApp 				= responseData.data[0]['openApproachingSLAs']['byApp'];
			ctrl.byPerson 			= responseData.data[0]['openApproachingSLAs']['byPerson'];
			ctrl.byEscalation 		= responseData.data[0]['escalations']['all'];
			ctrl.byTicketCategories = responseData.data[0]['ticketVolume'];
			ctrl.bySLACompliance 	= responseData.data[0]['resolutionSLACompliance'];

			updateSLAComplianceTeam();
			updateSLAComplianceApp();
			updateTicketVolume();
			escalationByPriority();
			escalationByApp();
 		});
	};

	init();
});
