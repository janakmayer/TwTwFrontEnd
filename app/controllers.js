(function() {

    var vizController = function ($scope, TwTwAPI) {
        $scope.data = null;
        $scope.getData = function () {
            TwTwAPI.viz_data({
                "timestamp":"2015-04-12 23:55:30",
                "timestamp_end":"2015-04-13 02:05:30"
            }).success(function(data){
                     $scope.data = data;
                    console.log($scope.data);

                    var colors = d3.scale.category20();
                    var keyColor = function(d, i) {return colors(d.key)};

                    var chart;
                    nv.addGraph(function() {
                        chart = nv.models.stackedAreaChart()
                            .useInteractiveGuideline(true)
                            .x(function(d) { return d[0] })
                            .y(function(d) { return d[1] })
                            .controlLabels({stacked: "Stacked"})
                            .color(keyColor)
                            .duration(300);

                        chart.xAxis.tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });
                        chart.yAxis.tickFormat(d3.format(',.2f'));

                        d3.select('#chart1')
                            .datum($scope.data)
                            .transition().duration(1000)
                            .call(chart)
                            .each('start', function() {
                                setTimeout(function() {
                                    d3.selectAll('#chart1 *').each(function() {
                                        if(this.__transition__)
                                            this.__transition__.duration = 1;
                                    })
                                }, 0)
                            });

                        nv.utils.windowResize(chart.update);
                        return chart;
                    });



                }
            );
        };
        $scope.getData();






    };

    vizController.$inject = ['$scope', 'TwTwAPI'];
    angular.module('myApp').controller('vizController', vizController);
}());