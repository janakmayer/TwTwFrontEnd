(function() {

    var barChart = function(){
        function link(scope, element, attributes){

            var margin = {top: 40, right: 30, bottom: 20, left: 40},
                width = 200 - margin.left - margin.right,
                height = 200 - margin.top - margin.bottom;

            var x = d3.scale.linear()
                .range([0, width], .1)

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(3)
                .tickFormat(d3.format("d"));

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(4);

            var v = '';
            var unitDict = {
                'tons': 'Million Tons LNG',
                'price': '$/MMBtu',
                'dollars': 'Billion Dollars',
                'yen': 'Hundred Billion Yen'
            };

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "Imports: <span style='color:#FF3333'>" + Math.round(d[v] * 100) / 100 + "</span> "+ unitDict[v];
                });

            var svg = d3.select(element[0]).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.call(tip);

            svg.append("g").attr("class", "x axis").append("text");
            svg.append("g").attr("class", "y axis").append("text");

            scope.$watchGroup(['data','v'], function(d) {
                var data = d[0];
                v = d[1];

                var max_v = 'max_' + v;
                var max_year = data[0].max_year;
                var min_year = data[0].min_year;
                var grouping = data[0][attributes.grouping];

                x.domain([min_year, max_year]);
                y.domain([0, data[0][max_v]]);

                svg.selectAll("g .x.axis")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .select("text")
                    .attr("text-anchor", "middle")
                    .classed('axislabel', true)
                    .attr("y", (height * -1)-10)
                    .attr("x", width /2)
                    .text(grouping);

                svg.selectAll("g .y.axis")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .select("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -36)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text(unitDict[v]);

                svg.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar");

                svg.selectAll(".bar")
                    .attr("x", function(d) { return x(d.year); })
                    .attr("width", 4)
                    .attr("y", function(d) { return y(d[v]); })
                    .attr("height", function(d) { return height - y(d[v]); })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

            });

        }
        return {
            link: link,
            restrict: 'E',
            scope: {
                data: '=',
                v: '@'
            }
        };
    };






    /**
     *
     * Pass all functions into module
     */

    angular
        .module('myApp')
        .directive('barChart', barChart)

}());