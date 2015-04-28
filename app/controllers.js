(function() {

    var vizController = function ($scope, $filter, TwTwAPI) {
        $scope.clicked = {};
        $scope.demo1 = {
        			min: 1429999200 * 1000,
                    model_min: 1429999400 * 1000,
                    model_max: 1430045900 * 1000,
        			max: 1430046000 * 1000
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


        $scope.getData = function () {



            TwTwAPI.settingOptions()
                .success(function(response){
                    console.log(response);
                    $scope.graph = response;
                });
        };

        //$scope.getData();

        var data = [{
            series: [{
                name: 'Strongly Negative',
                data: [502, 635, 809, 947, 1402, 3634, 5268, 502, 635, 809, 947, 1402, 3634, 5268]
            }, {
                name: 'Moderately Negative',
                data: [106, 107, 111, 133, 221, 767, 1766, 106, 107, 111, 133, 221, 767, 1766]
            }, {
                name: 'Neutral',
                data: [163, 203, 276, 408, 547, 729, 628, 163, 203, 276, 408, 547, 729, 628]
            }, {
                name: 'Moderately Positive',
                data: [18, 31, 54, 156, 339, 818, 1201, 18, 31, 54, 156, 339, 818, 1201]
            }, {
                name: 'Strongly Positive',
                data: [163, 203, 276, 408, 547, 729, 628, 163, 203, 276, 408, 547, 729, 628]
            }],
            categories: ['1429999200', '1430002800', '1430006400', '1430010000', '1430013600', '1430017200',
                '1430020800', '1430024400', '1430028000', '1430031600', '1430035200', '1430038800', '1430042400', '1430046000'],
            title: {
                text: 'Jeb Bush'
            }
        },{
            series: [{
                name: 'Strongly Negative',
                data: [502, 635, 809, 947, 1402, 3634, 5268, 502, 635, 809, 947, 1402, 3634, 5268]
            }, {
                name: 'Moderately Negative',
                data: [106, 107, 111, 133, 221, 767, 1766, 106, 107, 111, 133, 221, 767, 1766]
            }, {
                name: 'Neutral',
                data: [163, 203, 276, 408, 547, 729, 628, 163, 203, 276, 408, 547, 729, 628]
            }, {
                name: 'Moderately Positive',
                data: [18, 31, 54, 156, 339, 818, 1201, 18, 31, 54, 156, 339, 818, 1201]
            }, {
                name: 'Strongly Positive',
                data: [106, 107, 111, 133, 221, 767, 1766, 106, 107, 111, 133, 221, 767, 1766]
            }],
            categories: ['1429999200', '1430002800', '1430006400', '1430010000', '1430013600', '1430017200',
                '1430020800', '1430024400', '1430028000', '1430031600', '1430035200', '1430038800', '1430042400', '1430046000'],
            title: {
                text: 'Ted Cruz'
            }
        }

        ];



        
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
                        groupPadding: 0.01,
                        events: {click: function(event){
                            $scope.clicked = {candidate: event.delegateTarget.chart.title.textStr,
                                time: event.point.category};
                            $scope.$apply()
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


            var newData = [];
            var len = data.length;
            for (var i=0; i<len; ++i) {
                if (i in data) {
                    var d = data[i];
                    newData[i] = angular.copy(template);
                    newData[i].series = d.series;
                    var categories = angular.copy(d.categories);
                    newData[i].xAxis.categories = categories;
                    var clen = categories.length;
                    for (var j=0; j<clen; ++j) {
                        if (j in categories) {
                            newData[i].xAxis.categories[j] = $filter('date')(categories[j]*1000, "MM/dd/yyyy h:mma");
                        }
                    }
                    newData[i].title = d.title;
                }
            }
            $scope.newData = newData;
        };

        $scope.$watch('stacking', function() {
            console.log($scope.stacking.value);
            $scope.updateChart()

        });


    };

    vizController.$inject = ['$scope', '$filter', 'TwTwAPI'];
    angular.module('myApp').controller('vizController', vizController);
}());