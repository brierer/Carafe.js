define([
        "jquery.handsontable.full",
        "./service"
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
                replace: true,
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
        app.factory("CarafeService", function() {
            return {
                readOnly_widget: {
                    val: false
                }
            }
        })
    });
