define([
        "./directive"
    ],
    function() {
        var app = angular.module('myApp.editor')
        app.controller('EditorController', function($scope, CarafeService) {
            $scope.onChange = function() {
                $scope.$apply(function() {
                    CarafeService.readOnly_widget.val = true
                })
            }
        })

 


    });
