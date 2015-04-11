(function() {
    var TwTwAPI = function($http) {

        var server_url = 'http://127.0.0.1:5000';

        var factory = {};
        factory.viz_data = function(params) {
            return $http.put(server_url+'/viz', params);
        };
        return factory;
    };

    TwTwAPI.$inject = ['$http'];
    angular.module('myApp').factory('TwTwAPI', TwTwAPI);

}());