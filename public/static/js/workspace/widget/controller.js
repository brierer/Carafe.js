define([
        "./directive",
        "./service",

    ],
    function(directive, service) {

        var app = angular.module('myApp.widget')
        app.controller('WidgetController',
            function($rootScope, $scope, $q, $timeout, CarafeService, TableService, WidgetsService, LogService, EditorService) {
                var ajax = $q.all([])
                var timeout;
                var timeoutPromise = $q.all([]);
                loadRemoteData()
                LogService.setCallBack(sendLog)
                $scope.cs = CarafeService
                $scope.is_updating = false
                $scope.needUpdate = false
                // I apply the remote data to the local scope.
                function applyRemoteData(data) {
                    if (data.res != undefined)
                        $scope.widgets = data.res;
                    $scope.message = data.msg
                    EditorService.setEQ(data.eq);
                }

                function applyRemoteEQ(data) {
                    if (data.res != undefined)
                        for (var i = data.res.length - 1; i >= 0; i--) {
                            $scope.widgets.data = data.res.data
                        };
                    $scope.message = data.msg
                    $scope.needUpdate = true
                    EditorService.setEQ(data.eq);
                }
                // I load the remote data from the server.
                function loadRemoteData() {
                    WidgetsService.getWidgets()
                        .then(
                            function(Widget) {
                                applyRemoteData(Widget);

                            }
                    );
                    $rootScope.ready = true    
                }

                function sendLog(log, callback) {
                    if (timeout) $timeout.cancel(timeout);
                    timeoutPromise.then(function() {
                        sendTimeout(log, callback)
                    })
                }


                function sendTimeout(log, callback, fn) {
                    timeout = $timeout(function() {
                        sendAjax(WidgetsService.sendLog(log),
                            function() {
                                sendAjax(WidgetsService.getWidgets(), function(Widget) {
                                    applyRemoteEQ(Widget);
                                    callback()
                                })
                            }
                        )
                    }, 1000);
                }

                function sendAjax(fn, callback) {
                    ajax = fn.then(callback)
                }

                function getUpdate() {
                    sendAjax(WidgetsService.getWidgets(),
                        function(Widget) {
                            applyRemoteData(Widget);
                            $scope.cs.widget.readOnly = false
                            $scope.cs.editor.readOnly = false
                            $scope.is_updating = false
                            $scope.needUpdate = false
                        }
                    )
                }

                function sendUpdate() {
                    ajax.then(function() {
                        timeout = $timeout(function() {
                            sendAjax(WidgetsService.sendLog([]),
                                function() {
                                    getUpdate()
                                })
                        }, 10);
                    })
                }
                $scope.update = function update() {
                    if (!$scope.is_updating) {
                        $scope.is_updating = true
                        $scope.cs.widget.readOnly = true
                        $scope.cs.editor.readOnly = true
                        sendUpdate()
                    }
                }

            })
    });
