"use strict";
angular.module("opsDashboard").filter('sumByKey', function () {
    return function (data, key) {
        if (typeof (data) === 'undefined' || typeof (key) === 'undefined') {
            return 0;
        }
        var sum = 0;
        for (var i = data.length - 1; i >= 0; i--) {
            sum += parseInt(data[i][key]);
        }
        return sum;
    };
}).controller("otHomeController", function(myAppFactoryOT,shared, $state, $scope, $mdSidenav,$window, $mdComponentRegistry,dashboardService){

	var ctrl = this;
	this.auth = shared.info.auth;
	this.userRole = $state.current.data.userRole;
	this.toggle = angular.noop;
	this.title = $state.current.title;
	this.dashboardSummary = {
		raisedTodayCount: 0,
		solvedTodayCount: 0,
		escalations: {
			my : {
				totalCount : 0
			}
		},
		openCount: {
			myOpenS1Count: 0,
			myOpenS2Count: 0,
			myOpenS3Count: 0,
			myOpenS4Count: 0,
			openTotalCount: 0
		},
		ticketVolume: 0,
		ticketTrendThisYear: 0
	};

	this.byMyApprochingSLA =	[];
	this.bySLACompliance =	[];
	this.bySLAComplianceApp =	[];
	this.bySLAComplianceTeam =	[];
	this.byEscalation =	[];
	this.byMyEscalation =	[];
	this.myContribution =	[];

	this.byTicketCategories =	[];
	this.ticketCategoryGroups = [
		{ id: "WTDData", label: 'WTD' },
		{ id: "MTDData", label: 'MTD' },
		{ id: "QTDData", label: 'QTD' },
		{ id: "YTDData", label: 'YTD' }
	];

	this.escalationsList = [
		{ id: "byApp", name: 'Application' },
		{ id: "byPriority", name: 'Priority' }
	];

	this.eslGroup = { id: "byPriority", name: 'Priority'};
	this.selectedApp = { id: "WTDData", name: 'WTD'};
	this.ticketVolumeByApp = { id: "WTDData", name: 'WTD'};
	this.selectedTeam = { id: "WTDData", name: 'WTD'};

	this.ticketVoulmeByApp	 = "WTDData";
	this.isOpen = function() {return false };
	$mdComponentRegistry.when("right").then( function(sideNav){
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

	 $scope.myContributionDataset = [];

	 $scope.escalationDataset = [];
	 $scope.escalationData = [];
	 $scope.pieDataset = [];

	 $scope.onEscalationChange = function() {
		  var chartBy	=	ctrl.eslGroup.id;
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


	$scope.onTicketValumeChange = function() {
		updateTicketVolume();
    };

	$scope.onSLAComplianceChange = function() {
		 updateSLACompliance();
    };

	function updateSLACompliance(){
		ctrl.bySLAComplianceApp = ctrl.bySLACompliance[ctrl.selectedApp.id];
	}

	  // Escalation by Application Example

  function updateEscalation(){
	 var chartBy	=	ctrl.eslGroup.id;
	 $scope.escalationData	=	[];
	  var eslData	=	ctrl.byEscalation[chartBy];
	  for(var i=0;i<eslData.length;i++){
		  if(chartBy =="byPriority"){
		  	$scope.escalationData.push({label: eslData[i]['priority'],data: eslData[i]['escCount']});

		  }
		  /*else if(chartBy =="byApp"){
		  	$scope.escalationData.push({label: eslData[i]['appName'],data: eslData[i]['escCount']});

		  }*/
		}
		$scope.escalationDataset = $scope.escalationData;
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

// Escalation By Applications 

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
			container: '.escalations-Chart.legend-container'
		},
		xaxis:{
				ticks:[]
			}
	}, shared.chartCommonOptions);

// End



	$scope.onCategoryGroupChange = function() {
		updateTicketVolum();
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

  // Ticket Voulme By Application
  var x1,x2 ;
  x1=-25;
  x2=25; 
	$scope.ticketVolumeDataset = [
		{
			label: 'Raised',
			data: [],
			color: shared.color.blue,
			bars: {
				show: true,
				order: 1,
				fillColor: shared.color.lightblue
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
					fillColor: shared.color.lightamber
				},
				 valueLabels: {
					 font: "Roboto Condensed",
					fontcolor: '#666',
					fontsize: '12px',
						xoffset: x2,
						yoffset: 0,
						show: true
				}
		}
	];


	$scope.ticketVolumeOptions = angular.merge({
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
  $scope.onMyContributionChange= function(){
	  updateMyContribution();
  }
  function updateMyContribution(){
	  var dataId 	= ctrl.selectedTeam.id;
	 $scope.myContributionData	=	[];
	  var myData	=	ctrl.myContribution[dataId];
	  for(var i=0;i<myData.length;i++){
			  if( myData[i]['label']=='Me'){
				$scope.myContributionData.push({label: myData[i]['label'],data: myData[i]['myResolvedCount']});
			  }else if(myData[i]['label']=='Team'){
				$scope.myContributionData.push({label: myData[i]['label'],data: myData[i]['teamResolvedCount']});
			  }
		}
		$scope.myContributionDataset = $scope.myContributionData;
		$scope.myContributionDataset[0].color = shared.color.lime;
		$scope.myContributionDataset[1].color = shared.color.green;
  }

  //myContributionOptions;
  var containerLabel	=" Resolved by :";
  $scope.myContributionOptions = angular.merge({
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



	var TO = false;
	var onResize = function() {
		
		if(TO !== false) {
			clearTimeout(TO);
		}
		TO = setTimeout(function(){
			$scope.ticketVolumeDataset[0].valueLabels.xoffset =-15;
			$scope.ticketVolumeDataset[1].valueLabels.xoffset = 15;
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

		myAppFactoryOT.getData().then(function (responseData) {

			ctrl.byApp 				= responseData.data[0]['openApproachingSLAs']['all']['byApp'];
			ctrl.byMyApprochingSLA	= responseData.data[0]['openApproachingSLAs']['my']['byApp'];
			ctrl.byEscalation	 	= responseData.data[0]['escalations']['all'];
			ctrl.byMyEscalation	 	= responseData.data[0]['escalations']['my']['byApp'];
			ctrl.byTicketCategories = responseData.data[0]['ticketVolume'];
			ctrl.bySLACompliance 	= responseData.data[0]['myResolutionSLACompliance'];
			ctrl.myContribution 	= responseData.data[0]['myResolutionContribution'];

			updateEscalation();
			updateMyContribution();
			updateTicketVolume();
			updateSLACompliance();
			//escalationByApp();
			setTimeout(function(){
				$('div.myContribution-Chart').find('table > tbody').html('<tr><td>Resolved by</td><td class="legendColorBox"><div style="border:1px solid transparent;padding:1px"><div style="width:4px;height:0;border:5px solid #43A047;overflow:hidden"></div></div></td><td class="legendLabel">Me</td><td class="legendColorBox"><div style="border:1px solid transparent;padding:1px"><div style="width:4px;height:0;border:5px solid #AEEA00;overflow:hidden"></div></div></td><td class="legendLabel">Team</td></tr>')
			},500);
			
		});
	};
	init();
});
