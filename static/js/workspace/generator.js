define(["jquery", "validator", "./fnList"], function($, validator, fnList) {

    function init(app) {

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

        app.factory('Data', function() {
            return {
                inputSelected: null
            };
        });


        app.controller('FunctionGenerator',
            function($scope, WidgetService) {
                var selectedInput;
                $scope.inputs = []
                $scope.fnDict = fnList.list
                $scope.fnSelected = null
                $scope.hide = true
                $scope.widget = WidgetService


                $scope.update = function(inputs) {
                    $scope.fnSelected.callback.call($scope)
                    $scope.hide = true
                };

                $scope.reset = function() {
                    $scope.user = angular.copy($scope.master);
                };

                $scope.isUnchanged = function(inputs) {
                    return angular.equals(inputs, $scope.master);
                };

                $scope.cancel = function() {
                    $scope.hide = true
                }

                $scope.changeSelectedFn = function(fn) {
                    if (fn != undefined && fn.argument != undefined) {
                        $scope.hide = false
                        $scope.inputs = angular.copy(fn.argument)
                        $scope.fnSelected = fn
                    }
                }
                $scope.selectedInput = function(elm) {
                    selectedInput = elm
                    $scope.widget.data.fnAfterChange = function(value) {
                        elm.value = value;
                        $scope.$apply()
                        return value
                    }
                }
                $scope.isSelectedInput = function(elm) {
                    return selectedInput == elm
                }


            }

        );



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

    }


    return {
        init: init
    }


})
