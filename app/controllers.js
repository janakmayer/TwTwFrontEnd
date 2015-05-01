(function() {

    var vizController = function ($scope, $filter, TwTwAPI) {
        $scope.clicked = {};
        $scope.timeslider = {
        			min: 1429999200000,
                    model_min: 1429999200000,
                    model_max: 1430046000000,
        			max: 1430046000000
        		};
        $scope.params = {};
        $scope.stackingOpts = [
            { label: 'Absolute', value: 'normal', axislabel:'Tweets' },
            { label: 'Percentage', value: 'percent', axislabel:'Percent' }
          ];
        $scope.stacking = $scope.stackingOpts[1];


        $scope.params.candidates = ["Ted Cruz", "Jeb Bush", "Scott Walker", "Chris Christie", "Mike Huckabee",
            "Marco Rubio", "Rand Paul", "Rick Santorum", "Rick Perry", "Bobby Jindal"];

        $scope.params.candidatesSelected = ["Ted Cruz", "Jeb Bush", "Scott Walker", "Chris Christie", "Mike Huckabee",
            "Marco Rubio", "Rand Paul", "Rick Santorum", "Rick Perry", "Bobby Jindal"];


        $scope.data = null;

        $scope.init = function(){
            TwTwAPI.timeRange()
                .success(function(response){
                    $scope.timeslider.min = response[0]*1000;
                    $scope.timeslider.model_min = (response[1]-604800)*1000;
                    $scope.timeslider.model_max = response[1]*1000;
                    $scope.timeslider.max = response[1]*1000;
                    $scope.getData();
                });
        };

        $scope.getData = function () {

            TwTwAPI.chartData(($scope.timeslider.model_min/1000).toString()+'&'+($scope.timeslider.model_max/1000).toString())
                .success(function(response){
                    $scope.data = response['response'];
                    $scope.updateChart();
                });
        };
        
        $scope.getTweets = function (index, candidate) {
            console.log($scope.data[0].categories[index]);
            TwTwAPI.tweetData($scope.data[0].categories[index].toString()+'&'+candidate)
                .success(function(response){
                    $scope.tweets = response['tweets'];
                    $scope.hashtags = response['hashtags'];
                });
        };


        $scope.updateChart = function () {
            var template = {

                options: {
                    chart: {
                        type: 'column'
                    },
                    colors: ['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641'],
                    plotOptions: {
                        column: {
                            stacking: $scope.stacking.value,
                            pointPadding: 0,
                            borderWidth: 0
                        },
                        series: {
                            groupPadding: 0,
                            events: {click: function(event){
                                $scope.clicked = {candidate: event.delegateTarget.chart.title.textStr,
                                    time: event.point.category};
                                $scope.$apply();
                                $scope.getTweets(event.point.index, event.delegateTarget.chart.title.textStr);
                        }}}
                    },
                    tooltip: {
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:.0f})<br/>',
                    shared: true,
                        backgroundColor: "rgba(55, 55, 55, 0.5)",
                        borderColor:"rgba(55, 55, 55, 0.5)",
                        style: {
                            fontSize: '10px',
                            color: 'white'
                        }
                    }

                },
                    xAxis: {
                    categories: [],
                    tickmarkPlacement: 'on',
                    title: {
                        enabled: false
                    }
                },
                yAxis: {
                    title: {
                        text: $scope.stacking.axislabel
                    }
                },
                series: [],
                title: {},

                loading: false
            };

            if ($scope.data !== null) {
                var newData = [];
                var len = $scope.data.length;
                for (var i = 0; i < len; ++i) {
                    if (i in $scope.data) {
                        var d = $scope.data[i];
                        newData[i] = angular.copy(template);
                        newData[i].series = d.series;
                        var categories = angular.copy(d.categories);
                        newData[i].xAxis.categories = categories;
                        var clen = categories.length;
                        for (var j = 0; j < clen; ++j) {
                            if (j in categories) {
                                newData[i].xAxis.categories[j] = $filter('date')(categories[j] * 1000, "MM/dd/yyyy h:mma");
                            }
                        }
                        newData[i].title = d.title;
                    }
                }
                $scope.newData = newData;
            }
        };

        $scope.changeChart = function(){
            console.log("Change was called");
            $scope.updateChart();
        };

        $scope.init();

    };

    vizController.$inject = ['$scope', '$filter', 'TwTwAPI'];
    angular.module('myApp').controller('vizController', vizController);
}());