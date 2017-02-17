"use strict";

angular.module("opsDashboard").factory('LoginFactory', function($q,$http ) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;
			var isAuth	=	false;
			var isRole;
			//self.querySearch = function (query) {
			 $http.get('login.json').success(function(response) { 
			    var resLength	=	response.length;
				for(var i=0;i<resLength;i++){
					 if (name == response[i]['username'] && pw == response[i]['password']) {
						isAuth =	true;
						isRole =	response[i]['userProfile']['role'];
					}
				}
				if(isAuth){
					deferred.resolve(isRole);
				} else {
					deferred.reject('Wrong credentials.');
				}
			});
			
			
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
});
