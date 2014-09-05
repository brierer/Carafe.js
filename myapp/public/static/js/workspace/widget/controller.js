define([
        "./directive",
        "./service",

    ],
    function(directive, service) {

        var app = angular.module('myApp.widget')
        app.controller('WidgetController',
            function($scope, $q, $timeout, CarafeService, TableService, WidgetsService, LogService) {
                alert("salut")
                var timeout;
                var timeoutPromise = $q.all([]);
                loadRemoteData()
                LogService.setCallBack(sendLog)
                $scope.readOnly_widget = CarafeService.readOnly_widget
                // I apply the remote data to the local scope.
                function applyRemoteData(data) {
                    var widgets = []

                    for (i = 0; i < data.length; i++) {
                        widgets.push(new TableService.Table(data[i]))
                    }

                    $scope.widgets = widgets;

                }
                // I load the remote data from the server.
                function loadRemoteData() {
                    // The friendService returns a promise.
                    WidgetsService.getWidgets()
                        .then(
                            function(Widget) {
                                applyRemoteData(Widget);

                            }
                    );

                }

                var ajax

                function sendLog(log) {
                    if (timeout) $timeout.cancel(timeout);
                    if (ajax) {
                        ajax.then(function() {
                            timeout = $timeout(function() {
                                ajax = WidgetsService.sendLog(log)
                                ajax.then(
                                    function(Widget) {
                                        applyRemoteData(Widget);
                                    }
                                );
                            }, 1000);
                        })
                    } else {
                        timeoutPromise.then(function() {
                            timeout = $timeout(function() {
                                ajax = WidgetsService.sendLog(log)
                                ajax.then(
                                    function(Widget) {
                                        applyRemoteData(Widget);
                                    }
                                );
                            }, 1000);
                        })
                    }
                }

                $scope.update = function update() {


                }


            }
        )
    });
