(function() {
    var TwTwAPI = function($http) {

        var servers = {'local': 'http://127.0.0.1:5000', 'production': 'http://169.53.140.164:8000'};
        var server_url = servers.local;

        var factory = {};
        factory.settingOptions = function() {
            return $http.get(server_url+'/setting-options');
        };
        factory.sentimentGraph = function(params) {
            return $http.put(server_url+'/sentiment-graph', params);
        };
        factory.tweetDetails = function(params) {
            return $http.get(server_url+'/tweet-details/'+ params);
        };
        return factory;
    };

    TwTwAPI.$inject = ['$http'];
    angular.module('myApp').factory('TwTwAPI', TwTwAPI);

}());