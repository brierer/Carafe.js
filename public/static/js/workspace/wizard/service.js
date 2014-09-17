define([],
    function(
        rickshaw_fabric,
        handsontable_fabric) {
        var app = angular.module('myApp.wizard', ['myApp.widget'])
        app.factory('Data', function() {
            return {
                inputSelected: null
            };
        });

    });
