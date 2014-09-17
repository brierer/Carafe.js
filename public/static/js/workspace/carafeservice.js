define(["angular"],
    function() {
        var app = angular.module('myApp.carafe', [])
        app.factory("CarafeService", function() {
            return {
                editor: {
                    readOnly: false
                },
                widget: {
                    readOnly: false
                },

            }
        })

    });
