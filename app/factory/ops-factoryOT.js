"use strict";

angular.module("opsDashboard").factory('myAppFactoryOT', function ($http) {
        return {
            getData: function () {
                return $http({
                    method: 'GET',
                    url: 'dashboardSummaryOT.json'
                });
            }
        }
    });
