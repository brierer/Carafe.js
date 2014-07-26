define([
  "./eqobj",
   "./rickshaw-fabric", 
   "./handsontable-fabric" ,
   "./chart",
   "./table",
   "./carafe-scheme"], 
   function(
    eqobj,
    rickshaw_fabric,
    handsontable_fabric,
    chart,
    table) {
  return {displayData:displayData,
          setEditor : setEditor}
  
  var editor;
 
  function displayData(data) {
    
    if (data.parse !== undefined) {
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
    var handsontable = new handsontable_fabric.HDT_fabric(table,updateEditorText)
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

 
  function addTable(param) {
    var id = $(".table-container").length
    var nbCol = Number(param["nb-col"])
    var arr = [];
    for (var i = 0; i < nbCol; ++i) {
      arr.push(null);
    }
    for (var a = []; a.length < 1; a.push(arr.slice(0)));

    var f = createFunction("table", [createMatrix(nbCol, 0), createObject()])
    addShow(addEq(param["table-name"], f))
    updateEditorText()
    displayOneTable(eqobj.eqWrapper.getEQ(), validateTableWithArray(a), id)
    setWidget();
  }

  function setEditor(){


    editor = CodeMirror.fromTextArea(document.getElementById("id_equations"), {
      mode: "haskell",
      lineNumbers: true,
      theme: "elegant"

    });

    $("#editor").css("visibility", "visible");

  }
});