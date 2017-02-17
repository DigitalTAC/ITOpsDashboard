"use strict";

angular.module("opsDashboard").factory('myAppFactoryOM', function ($http) {
        return {
            getData: function () {
                return $http({
                    method: 'GET',
                    url: 'dashboardSummaryOM.json'
                });
            }
        }
    });
