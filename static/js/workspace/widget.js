define([
        "./eqobj",
        "./rickshaw-fabric",
        "./handsontable-fabric",
        "./chart",
        "./table",
        "./evaluator",
        "./carafe-scheme",
    ],
    function(
        eqobj,
        rickshaw_fabric,
        handsontable_fabric,
        chart,
        table,
        evaluator) {

        function init(app) {
            var editor;
            app.factory("WidgetService", function() {
                var data = {
                    fnAfterChange: function(v) {
                        return "widget"
                    }
                }
                var message = {
                    fn: function() {
                        return ""
                    }
                }


                function displayData(data) {
                    if (data != null && data.parse !== undefined) {
                        updateEditorText()
                        if (data.eval.statut == "ok") {
                            displayWidgetFactory(data.parse, data.eval.res);
                            message.fn("")
                        } else if (data.statut == 'tko') {
                            displayBadEval(data.eval);
                        } else if (data.statut == 'ko') {
                            displayError(data.eval);
                        }
                    }
                }



                function displayError(data) {
                    var html = "";
                    html += data.res;
                    html += "<br/>"
                    html += JSON.stringify(data.stack);
                    $("#containment-wrapper").html(html);
                }

                function displayBadEval(data) {
                    var html = "";
                    html += data.res;
                    html += "<br/>"
                    html += JSON.stringify(data.stack);
                    $("#containment-wrapper").html(html);
                }



                function displayWidgetFactory(parse, data) {
                    var html = "";
                    $("#containment-wrapper").html(html);
                    $(data).each(function(id, d) {
                        if (this instanceof Array) {
                            displayOneTable(table.Table.fromArray(parse, this, id));
                        }
                        if (this.type == 'table') {
                            displayOneTable(table.Table.fromNative(parse, this, id));
                        }
                        if (this.type == 'graph') {
                            displayChart(chart.Chart.fromNative(this));
                        }
                    })

                    setWidget();
                    $('#invisible-wrapper').css("visibility", "hidden");

                }

                function displayChart(chart) {

                    $("#containment-wrapper").append("<div class='chart-container ui-widget-content draggable'><div class='chart-title'></div><div id='y_axis'></div><div id='chart' class='chart'></div><div id='x_axis'></div></div>")

                    var graph = rickshaw_fabric.Rickshaw_fabric(chart, {
                        chart: document.querySelector("#chart"),
                        x_axis: document.querySelector("#x_axis"),
                        y_axis: document.querySelector("#y_axis")
                    });
                    graph.render();
                    $(".chart-title").html(chart.param.title);
                }


                function displayOneTable(table) {
                    $("#containment-wrapper").append("<div class='table-container ui-widget-content draggable'><div class='handsontable-wrapper'></div<</div>")
                    $('#containment-wrapper div').last().outerWidth(table.width);
                    var handsontable = new handsontable_fabric.HDT_fabric(table, updateEditorText, data, $("#containment-wrapper"))
                    var tableAdd = $('#containment-wrapper div.handsontable-wrapper').last()
                    tableAdd.handsontable(handsontable.options);
                    if (table.param.grid === 0)
                        tableAdd.find("td").css("border-width", "0")
                    if (table.param.align === "center")
                        tableAdd.find("td").addClass("text-center")
                }


                function updateEditorText() {
                    editor.getDoc().setValue(eqobj.eqWrapper.toStr());
                    editor.save();
                }

                function addToEditorText(name, value, toshow) {
                    if (toshow) {
                        eqobj.addShow(name)
                        updateEditorText()
                    }
                    var preText = editor.getDoc().getValue()
                    $('#invisible-wrapper').css("visibility", "visible");
                    if (message.fn != null) message.fn("Please, reload the page with GO!")
                    if (name != null && name.length > 0) {
                        editor.getDoc().setValue(preText + "\n" + name + " = " + value)
                    } else {
                        editor.getDoc().setValue(preText + "\n" + value)
                    }
                }

                function setWidget() {
                    setDraggableWidget();
                    setIconTable();
                }

                function setDraggableWidget() {
                    $(".ui-widget-content").draggable({
                        containment: "parent",
                        handle: "thead"
                    });
                }

                function setIconTable() {
                    $("th").find("i").click(function(e) {

                        var $contextMenu = $("#contextMenu");


                        $contextMenu.css({
                            display: "block",
                            left: e.pageX,
                            top: e.pageY
                        });


                        $contextMenu.on("click", "a", function() {
                            $contextMenu.hide();
                        });
                        var contextVisible = false;

                        $("#dashboard").click(function() {
                            if (contextVisible) {
                                $contextMenu.hide();
                                contextVisible = false;
                                $("#dashboard").unbind();
                            } else {
                                contextVisible = true;
                            }
                        });

                    });


                    $("th").mouseover(function() {
                        $(this).find("i").removeClass("hidden");
                    });
                    $("th").mouseout(function() {
                        $(this).find("i").addClass("hidden");
                    });

                }


                function addTable(name, nbcol) {
                    var nbCol = parseInt(nbcol)
                    var arr = new Array(nbCol);
                    for (var a = []; a.length < 1; a.push(arr.slice(0)));
                    var f = eqobj.createFunction("table", [eqobj.createFunction(name + "Data", []), eqobj.createObject([])])
                    var eqs = eqobj.addEq(name, f)

                    eqobj.addEq(name + "Data", eqobj.createMatrix(nbCol, 0));
                    eqobj.addShow(name)
                    displayOneTable(table.Table.fromArray(eqs, a, null))
                    setWidget();
                }

                function addTableWithData(name, data, header) {
                    var a = data
                    var nbCol = data[0].length
                    var colName = []
                    console.log(header)
                    if (header) {
                        console.log(data[0].length)
                        for (var i = 0; i < data[0].length; i++) {
                            colName.push(eqobj.createString(data[0][i]))
                        }
                    }
                    console.log(colName.length)
                    var col = eqobj.createObject([
                        ['col', eqobj.createArray(colName)]
                    ])
                    var f = eqobj.createFunction("table", [eqobj.createFunction(name + "Data", []), col])
                    var eqs = eqobj.addEq(name, f)

                    eqobj.addEq(name + "Data", eqobj.createMatrix(nbCol, 0));
                    eqobj.addShow(name)
                    displayOneTable(table.Table.fromArray(eqs, a, null, header))
                    setWidget();
                }

                function setEditor() {


                    editor = CodeMirror.fromTextArea(document.getElementById("id_equations"), {
                        mode: "haskell",
                        lineNumbers: true,
                        theme: "elegant",
                        onKeyEvent: function(editor, event) {
                            $('#invisible-wrapper').css("visibility", "visible");
                            if (message.fn != null) message.fn("Please, reload the page with GO!")
                        }

                    });

                    $("#editor").css("visibility", "visible");
                    return editor

                }
                return {
                    data: data,
                    message: message,
                    displayData: displayData,
                    addTable: addTable,
                    addTableWithData: addTableWithData,
                    addToEditorText: addToEditorText,
                    editor: setEditor()
                }
            });


            app.controller('WidgetController',
                function($scope, WidgetService) {
                    $scope.WidgetService = WidgetService
                    $scope.btnTxt = "GO!"
                    WidgetService.message.fn = function(msg) {
                        $scope.message = msg
                    }
                    $scope.update = function() {
                        
                        $scope.WidgetService.editor.save()
                        $scope.message = ""
                        $scope.btnTxt = "..."
                        angular.element(document).ready(function() {
                            while ($scope.updateData==null){console.log("null")}
                                console.log($scope.updateData)
                            evaluator.eqEvaluation($scope.updateData)
                        })
                        $scope.btnTxt = "GO!"
                    }

                    $scope.updateData = function(data) {
                        $scope.data = data
                        $scope.WidgetService.displayData(data)
                    }

                    evaluator.initPollingGetCalcResult($scope.updateData)

                }

            )
        }

        return {
            init: init
        }
    });
