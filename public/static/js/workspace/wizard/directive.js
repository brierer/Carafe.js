define([
        "./service"
    ],
    function(
        rickshaw_fabric,
        handsontable_fabric) {
        var app = angular.module('myApp.wizard')
        var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
        app.directive('smartFloat', function() {
            return {
                require: 'ngModel',
                scope: {
                    fn: '&smartFloat'
                },
                link: function(scope, elm, attrs, ctrl) {
                    if (scope.fn != null && scope.fn() != null) {
                        var valid_fn = scope.fn().fn
                        ctrl.$parsers.unshift(function(viewValue) {
                            if (viewValue == undefined || viewValue.length == 0) {
                                ctrl.$setValidity('valid', true)
                                return viewValue
                            }
                            var valid_value = valid_fn(viewValue)
                            if (typeof valid_value == "boolean") {
                                ctrl.$setValidity('valid', valid_value);
                                return viewValue
                            } else {
                                ctrl.$setValidity('valid', valid_value !== undefined);
                                return valid_value;
                            }
                        });
                    }
                }
            };
        });

        app.directive("smart", function() {
            return {
                restrict: 'A',
                link: function($scope, el, attrs) {
                    el.bind("change", function(e) {
                        if ((e.srcElement || e.target).files != null)
                            $scope.fnSelected.file = (e.srcElement || e.target).files[0];
                    });
                }
            }
        })
    });
