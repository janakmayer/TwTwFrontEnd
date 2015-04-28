(function() {

	'use strict';

    var sigmaGraph = function() {

		//over-engineered random id, so that multiple instances can be put on a single page
		var divId = 'sigmjs-dir-container-'+Math.floor((Math.random() * 999999999999))+'-'+Math.floor((Math.random() * 999999999999))+'-'+Math.floor((Math.random() * 999999999999));

        function link(scope, element, attrs) {

            // Let's first initialize sigma:
            var s = new sigma({
                container: divId,
                settings: {
                    maxNodeSize:3,
                    minEdgeSize: 0.1,
                    maxEdgeSize: 0.2,
                    zoomMax: 10,
                    zoomMin: .01

                }
            });

            s.bind('clickNode', function(e) {
                scope.selectedNode = e.data.node.id;
                scope.$apply();
            });

            scope.$watch('graph', function(newVal,oldVal) {
                if (1==1) {
                    console.log('graph watch was triggered');
                    s.graph.clear();
                    s.graph.read(scope.graph);
                    s.refresh();
                }
            });

            scope.$watch('width', function(newVal,oldVal) {
                console.log("graph width: "+scope.width);
                element.children().css("width",scope.width);
                s.refresh();
                window.dispatchEvent(new Event('resize')); //hack so that it will be shown instantly
            });
            scope.$watch('height', function(newVal,oldVal) {
                console.log("graph height: "+scope.height);
                element.children().css("height",scope.height);
                s.refresh();
                window.dispatchEvent(new Event('resize'));//hack so that it will be shown instantly
            });

            element.on('$destroy', function() {
                s.graph.clear();
            });
        }

        return {
			link: link,
            restrict: 'E',
			template: '<div id="'+divId+'" style="width: 100%;height: 100%;"></div>',
			scope: {
				//@ reads the attribute value, = provides two-way binding, & works with functions
				graph: '=',
				width: '@',
				height: '@',
                selectedNode:'=',
				releativeSizeNode: '='
			}
		};

	};


    /**
     *
     * Pass all functions into module
     */
    angular
        .module('myApp')
        .directive('sigmaGraph', sigmaGraph)
})();