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
               data = {fnAfterChange:function(v){return "widget"}}

                function displayData(data) {
                    console.log(data)
                    if (data != null && data.parse !== undefined) {
                        updateEditorText()
                        if (data.eval.statut == "ok") {
                            displayWidgetFactory(data.parse, data.eval.res);
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
                    var handsontable = new handsontable_fabric.HDT_fabric(table, updateEditorText, data,$("#containment-wrapper"))
                    var tableAdd = $('#containment-wrapper div.handsontable-wrapper').last()
                    tableAdd.handsontable(handsontable.options);
                }


                function updateEditorText() {
                    editor.getDoc().setValue(eqobj.eqWrapper.toStr());
                    editor.save();
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


                    var f = eqobj.createFunction("table", [eqobj.createMatrix(nbCol, 0), eqobj.createObject()])

                    var eqs = eqobj.addEq(name, f)
                    eqobj.addShow(name)
                    displayOneTable(table.Table.fromArray(eqs, a, null))
                    setWidget();
                }

                function addTableWithData(name, data, header) {
                    var a = data
                    var nbCol = data[0].length
                    var f = eqobj.createFunction("table", [eqobj.createMatrix(nbCol, 0), eqobj.createObject()])

                    var eqs = eqobj.addEq(name, f)
                    eqobj.addShow(name)
                    displayOneTable(table.Table.fromArray(eqs, a, null, header))
                    setWidget();
                }

                function setEditor() {


                    editor = CodeMirror.fromTextArea(document.getElementById("id_equations"), {
                        mode: "haskell",
                        lineNumbers: true,
                        theme: "elegant"

                    });

                    $("#editor").css("visibility", "visible");
                    return editor

                }
                return {
                    data: data,
                    displayData: displayData,
                    addTable: addTable,
                    addTableWithData: addTableWithData,
                    editor: setEditor()
                }
            });


            app.controller('WidgetController',
                function($scope, WidgetService) {
                    $scope.WidgetService = WidgetService
                    $scope.update = function() {
                        evaluator.eqEvaluation($scope.updateData)
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
