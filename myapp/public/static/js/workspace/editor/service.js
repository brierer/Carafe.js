define([],
    function() {
        var app = angular.module('myApp.editor', ["myApp.carafe"])
        app.factory('EditorService', function() {
            var eq = ""
            var callback;
            var changeCall = function(fn) {
                callback = fn
            }
            var setEQ = function(e) {
                if (e!=undefined)
                eq = e.contents
                if (e!=undefined)
                callback(e.contents)
            }
            var getEQ = function() {
                return eq
            }

            return {
                changeCall: changeCall,
                setEQ: setEQ,
                getEQ: getEQ,
                eq: eq
            };


        });

    });
