define([
        "jquery.handsontable.full",
        "highcharts",
        "./service",
    ],
    function() {

        var editor;
        var app = angular.module('myApp.widget')

        app.directive('handsontable', function() {
            return {
                restrict: 'A',
                scope: {
                    data: '='
                },
                replace: false,
                template: "<div></div>",
                link: function(scope, elem, attrs) {
                    var table = $(elem).handsontable(scope.data.options)
                    scope.data.render = table.render
                    scope.$watch('data', function(oldvalue, newvalue) {
                        table.handsontable('render')
                    }, true)
                }
            }
        })
        app.directive('plot', function() {
            return {
                restrict: 'A',
                scope: {
                    data: '='
                },
                replace: false,
                template: "<div></div>",
                link: function(scope, elem, attrs) {
                    console.log(JSON.stringify(scope.data))
                    var plot =  $(elem).highcharts(scope.data);

                   
                }
            }
        })

    });
