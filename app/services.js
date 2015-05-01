(function() {
    var TwTwAPI = function($http) {

        var servers = {'local': 'http://127.0.0.1:5000', 'production': 'http://198.23.67.172:8000'};
        var server_url = servers.production;

        var factory = {};
        factory.timeRange = function() {
            return $http.get(server_url+'/time-range/');
        };
        factory.chartData = function(params) {
            return $http.get(server_url+'/chart-data/' + params);
        };
        factory.tweetData = function(params) {
            return $http.get(server_url+'/tweet-data/'+ params);
        };
        return factory;
    };

    TwTwAPI.$inject = ['$http'];
    angular.module('myApp').factory('TwTwAPI', TwTwAPI);

}());