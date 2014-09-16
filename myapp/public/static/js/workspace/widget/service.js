define([],
    function(
        rickshaw_fabric,
        handsontable_fabric) {
        var app = angular.module('myApp.widget', ["myApp.carafe", 'myApp.editor'])
        app.factory("WidgetsService", function($http, $q, $timeout, TableService, PlotService, EditorService) {
            var b
            return ({
                getWidgets: getWidgets,
                sendLog: sendLog,
            });

            function sendLog(log) {
                console.log("send")
                var request = $http({
                    method: "post",
                    data: {
                        _key: 'asfd',
                        _eq: EditorService.getEQ(),
                        _event: log,
                        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                        book_id: $('input[name=book_id]').val(),
                        read_only: $('input[name=read_only]').val(),
                        form_id: $('input[name=form_id]').val()

                    },
                    url: "postCalcResult",
                });

                return request.then(function() {
                    console.log("endSend")
                }, handleError);

            }

            function getWidgets() {
                console.log("retrieve")
                var id_form = $("#id_form_id").serialize();
                var id_book = $("#id_book_id").serialize();
                var request = $http({
                    method: "get",
                    url: "getCalcResult/?" + id_form,
                });

                return request.then(handleSuccess, handleError);

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
                if (response.data == "" || response.data == null || response.data == "null" ) {
                    console.log("next try")
                    return getWidgets()
                } else {
                    console.log("back")
                    return convertToWidgets(response.data)
                }
            }

            function convertToWidgets(data) {
                var widgets = []
                if (data.tag == "OK") {
                    ws = data.res._ObjO[0][1]._ArrayData
                    for (var i = 0; i < ws.length; i++) {
                        widgets.push(convertToWidget(i, ws[i]))
                    }
                    return {
                        res: widgets,
                        eq: data.eq,
                        msg: null,
                    }
                } else {
                    return {
                        eq: data.eq,
                        msg: JSON.stringify(data.err) //createMessage(data.err)
                    }
                }
            }

            function createMessage(err) {
                var s = ""
                s += err.tag
                s += " at " + err.contents[1][0]
                s += err.contents[1][1]
                s += "  " + err.contents[1][2]
                return s
            }

            function convertToWidget(id, data) {
                var widget
                if (data.tag == "TableO") {
                    widget = new TableService.Table(id, data._TableData, data._TableParam)
                }
                if (data.tag == "PlotO") {
                    widget = new PlotService.Plot(id, data)
                }
                return widget
            }
        })
        app.factory("PlotService", function() {
            return {
                Plot: Plot
            }

            function Plot(id, data) {
                plotData = convertData_(data._PlotData),
                this.xAxis = {
                    categories: convertData(data._PlotData)[0]
                }
                this.series = [{
                    data: plotData[1]
                }]
                this.credits = {
                    enabled: false
                }
                this.title = {text:param(data._PlotParam, "title")}
             
            }

            function param(data, s) {
                var f  = data.find(function(elem) {
                    return (elem[0] == s)
                })
                if (f)
                return convertAtomicData_(f[1])
            }

            function convertData_(data) {
                var prettyData = []
                for (var col = 0; col < data[0].length; col++) {
                    var row = []
                    for (var cell = 0; cell < data.length; cell++) {
                        row.push(convertAtomicData_(data[cell][col]))
                    }
                    prettyData.push(row)
                }
                return prettyData
            }

            function convertArray_(data) {
                var row = []
                for (var cell = 0; cell < data.length; cell++) {
                    row.push(convertAtomicData_(data[cell]))
                }
                return row
            }

            function convertAtomicData_(value) {
                var prettyValue;
                if (value != null) {
                    if (value.tag == "NumO") {
                        prettyValue = value._NumO
                    }
                    if (value.tag == "StrO") {
                        prettyValue = value._StrO
                    }
                } else {
                    prettyValue = null
                }
                if (prettyValue == undefined)
                    prettyValue = null;
                return prettyValue
            }

        })
        app.factory("TableService", function(LogService) {
            return {
                Table: Table
            }

            function Table(id, data, param) {
                this.options = {
                    id: id,
                    data: convertData(data),
                    colHeaders: convertArray(param),
                    minSpareRows: 1,
                    stretchH: 'all',
                    width: Math.min(75 * data.length, 225),
                    colWidths: 25,
                    cells: function(row, col, prop) {
                        var cellProperties = {};
                        cell = data[col][row];
                        if (cell) {
                            cellProperties.readOnly = cell._ObjPos.tag != "Upd";
                        } else {
                            cellProperties.readOnly = false
                        }
                        return cellProperties;
                    },
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
                    LogService.add("CreateCol", id, {
                        index: index,
                        number: number
                    })
                }

                function afterRemoveCol(index, number) {
                    LogService.add("RemoveCol", id, {
                        index: index,
                        number: number
                    })
                }

                function afterCreateRow(index, number) {
                    if (index + 1 < this.countRows())
                        for (var r = 0; r < number; r++) {
                            LogService.add("CreateRow", id, {
                                index: index,
                                number: number
                            })
                        }
                }

                function afterRemoveRow(index, number) {
                    for (var r = 0; r < number; r++) {
                        LogService.add("RemoveRow", id, {
                            index: (index <= this.countRows() - 1) ? index : index - 1,
                            number: number
                        })
                    }
                }

                function afterChange(hooks) {
                    if (hooks != null) {
                        for (var i = 0; i < hooks.length; i++) {
                            //check si faut considerer le changement,qui est dans les limites de la grille
                            if (hooks[i][0] < this.countRows() - 1 || (hooks[i][0] == this.countRows() - 1) && hooks[i][3] != "") {
                                //si ajout faut ajouter des vides
                                if (hooks[i][0] + 1 >= this.countRows() - 1) {
                                    for (var c = 0; c < this.countCols(); c++) {
                                        console.log(this.getDataAtCell(hooks[i][0], hooks[i][1]))
                                        if (this.getDataAtCell(hooks[i][0], c) == "" || this.getDataAtCell(hooks[i][0], c) == null)
                                            LogService.add("Change", id, {
                                                index: hooks[i][0],
                                                number: c,
                                                old: "",
                                                now: "\"\"",
                                            })
                                    }
                                }
                                LogService.add("Change", id, {
                                    index: hooks[i][0],
                                    number: hooks[i][1],
                                    old: hooks[i][2],
                                    now: hooks[i][3] == "" ? "\"\"" : hooks[i][3],
                                })
                            }
                        }

                    }
                }
                //HELPER
                function makeArrayOf(value, length) {
                    var arr = [],
                        i = length;
                    while (i--) {
                        arr[i] = value;
                    }
                    return arr;
                }


            }

            function ErrTable(data) {
                this.options = {
                    data: convertData(data),
                    colHeaders: convertArray(param),
                    minSpareRows: 1,
                    stretchH: 'all',
                    width: Math.min(75 * data.length, 225),
                    colWidths: 25,
                    cells: function(row, col, prop) {
                        return cellProperties;
                    }
                }

            }
        })
        app.factory("LogService", function() {
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

            function clear() {
                log = []
            }

            function add(event, position, hook) {
                var change = {
                    _type: event,
                    _pos: position,
                    _hook: {
                        index: hook.index,
                        number: hook.number,
                        old: hook.old ? hook.old : "",
                        now: hook.now ? hook.now : ""
                    }
                }
                log.push(change)
                callBack(log, clear)
                return log
            }
        })

    });

function convertData(data) {
    var prettyData = []
    for (var col = 0; col < data[0].length; col++) {
        var row = []
        for (var cell = 0; cell < data.length; cell++) {
            row.push(convertAtomicData(data[cell][col]))
        }
        prettyData.push(row)
    }
    return prettyData
}

function convertArray(data) {
    var row = []
    for (var cell = 0; cell < data.length; cell++) {
        row.push(convertAtomicData(data[cell]))
    }
    return row
}

function convertAtomicData(value) {
    var prettyValue;
    if (value != null) {
        if (value.tag == "NumO") {
            prettyValue = JSON.stringify(value._NumO)
        } else if (value.tag == "StrO") {
            prettyValue = value._StrO
        }
    } else {
        prettyValue = null
    }
    if (prettyValue == undefined)
        prettyValue = null;
    return prettyValue
}
