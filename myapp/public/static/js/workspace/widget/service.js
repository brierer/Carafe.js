define([],
    function(
        rickshaw_fabric,
        handsontable_fabric) {
        var app = angular.module('myApp.widget', [])
        app.factory("WidgetsService", function($http, $q, $timeout) {
            var b
            return ({
                getWidgets: getWidgets,
                sendLog: sendLog,
            });

            function sendLog(log) {
                var request = $http({
                    method: "post",
                    data: b,
                    url: "postCalcResult/",
                });
                console.log("send:" + JSON.stringify(log))
                return (request.then(handleSuccess, handleError));

            }

            function getWidgets() {
                var id_form = $("#id_form_id").serialize();
                var id_book = $("#id_book_id").serialize();
                var request = $http({
                    method: "get",
                    url: "getCalcResult/?" + id_form,
                });

                return (request.then(handleSuccess, handleError));

            }

            // I transform the error response, unwrapping the application dta from
            // the API response payload.
            function handleError(response) {

                // The API response from the server should be returned in a
                // nomralized format. However, if the request was not handled by the
                // server (or what not handles properly - ex. server error), then we
                // may have to normalize it on our end, as best we can.
                if (!angular.isObject(response.data) ||
                    !response.data.message
                ) {

                    return ($q.reject("An unknown error occurred."));

                }

                // Otherwise, use expected error message.
                return ($q.reject(response.data.message));

            }

            function handleSuccess(response) {
                console.log("REceive:" + JSON.stringify(response.data))
                b = response.data
                return response.data
            }

        })
        app.factory("TableService", function(LogService) {
            return {
                Table: Table
            }

            function Table(data) {
                var safeHtmlRenderer = function(instance, td, row, col, prop, value, cellProperties) {
                    var escaped = Handsontable.helper.stringify(value);
                    //escaped = strip_tags(escaped, '<em><b><strong><a><big>'); //be sure you only allow certain HTML tags to avoid XSS threats (you should also remove unwanted HTML attributes)
                    td.innerHTML = escaped;
                    if (cellProperties.readOnly)
                        $(td).css("color", "#555")
                    return td;
                };

                this.options = {
                    data: data,
                    columns: makeArrayOf({
                        renderer: safeHtmlRenderer
                    }, data[0].length), //Array.apply(null, new Array(table.param.col.length)).map(Object.prototype.valueOf,{renderer:safeHtmlRenderer}),
                    colHeaders: true,
                    minSpareRows: 1,
                    stretchH: 'all',
                    width: Math.min(75 * data[0].length - 1, 750),
                    colWidths: 25,
                    afterChange: afterChange,
                    afterRemoveRow: afterRemoveRow,
                    afterRemoveCol: afterRemoveCol,
                    afterCreateRow: afterCreateRow,
                    afterCreateCol: afterCreateCol,
                    afterSelection: function(r, c, r1, c2) {

                    },
                    contextMenu: {

                        items: {
                            "row_above": {
                                disabled: function() {
                                    return (Math.min(this.getSelected()[2], this.getSelected()[0]) >= this.countRows() - 1);
                                }
                            },
                            "row_below": {
                                disabled: function() {
                                    return (Math.max(this.getSelected()[2], this.getSelected()[0]) >= this.countRows() - 2);
                                }
                            },
                            "remove_row": {
                                disabled: function() {
                                    return (Math.max(this.getSelected()[2], this.getSelected()[0]) >= this.countRows() - 1);
                                }
                            },
                            "hsep1": "---------",
                            "col_left": {},
                            "col_right": {},
                            "remove_col": {}

                        }
                    },
                    afterGetColHeader: function(col, TH) {
                        var instance = this
                        $(TH.firstChild).click(function(event) {
                            instance.selectCell(0, col, instance.countRows() - 2, col, true)
                        });
                    },
                }

                //EVENT
                function afterCreateCol(index, number) {

                }

                function afterRemoveCol(col) {

                }

                function afterCreateRow(index, number) {}

                function afterRemoveRow(row) {}

                function afterChange(hooks) {
                    if (hooks != null) {
                        for (var i = 0; i < hooks.length; i++) {
                            LogService.add("TableAfterChange", 0, hooks[i])
                        }
                    }
                }
                //HELPER
                function changeCell(handsontable, hook) {


                }



                function convertNullBeforeEndToEmptyString(that, table, row, col) {
                    for (var i = 0; i < row; i++) {
                        if (table.getDataAtCell(i, col) == null && i < table.countRows() - 1) {
                            //console.log(row)
                            that.event.afterChange({
                                'row': row,
                                'col': col,
                                'old': null,
                                'new': ""
                            });
                        }
                    }
                }

                function buildButton(col) {
                    var check = "<button  type='button' style='margin-left:10px' class='btn btn-xs btn-default' type='checkbox' ";
                    check += "nb=" + col
                    check += ">&#8597</button>"
                    return check
                }

                function makeArrayOf(value, length) {
                    var arr = [],
                        i = length;
                    while (i--) {
                        arr[i] = value;
                    }
                    return arr;
                }

            }

        })
        app.service("LogService", function(WidgetsService) {
            var log = []
            var callBack = function() {}

            return {
                add: add,
                setCallBack: setCallBack,
                log: log
            }

            function setCallBack(fn) {
                callBack = fn
            }

            function add(event, position, hook) {
                var change = {
                    event: event,
                    position: position,
                    hook: hook
                }
                log.push(change)
                callBack(log)
                return log
            }
        })
    });
