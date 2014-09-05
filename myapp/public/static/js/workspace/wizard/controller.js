define([
        "./directive",
        "./service",
        "workspace/fnList",
    ],
    function(directive, service, fnList) {

        var app = angular.module('myApp.wizard')
        app.controller('WizardController',
            function($scope, WidgetsService) {
                var selectedInput;
                $scope.inputs = []
                $scope.fnDict = fnList.list
                $scope.fnSelected = null
                $scope.hide = true
                $scope.widget =  WidgetsService


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
                    angular.element(document).ready(function() {
                        $('.icp-auto').iconpicker();
                    });

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
        )
    });
