define([
    "jquery",
    "./evaluator",
    "./eqobj",
    "./widget",
    "./fnList",
    "nod",
    "metisMenu",
], function($, evaluator, eqobj, widget, fnList) {

    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    var eqWrapper = eqobj.eqWrapper;


    $(function() {
        initComposent();
        evaluator.initPollingGetCalcResult();
    })



    function initComposent() {

        $(function() {

            $('#side-menu').metisMenu();

        });

        //Loads the correct sidebar on window load,
        //collapses the sidebar on window resize.
        // Sets the min-height of #page-wrapper to window size


        $("#formulaToggle").click(
            function() {
                if ($('#formula').is(':visible')) {
                    $('#formula').hide();
                    $("#page-wrapper").css("margin-left", "0px");
                } else {
                    $('#formula').show();
                    $("#page-wrapper").css("margin-left", "250px");
                }
            }
        );
    

        widget.setEditor();
        generator();
        $("#dashBoardToggle").click(
            function() {
                $("#dashboard").toggle();
            }
        );

        $("#equationToggle").click(
            function() {
                $("form").toggle();
            }
        );



        $("a").dblclick(function() {
            // insertAtCursor($(this).attr('title'));
        });

        $(".btn_eval").click(
            function() {
                eqEvaluation();
            });

        addFunctionsToMenu()
    }


    /*  function insertAtCursor(text) {
    var field = document.getElementById("id_equations");

    if (document.selection) {
      var range = document.selection.createRange();

      if (!range || range.parentElement() != field) {
        field.focus();
        range = field.createTextRange();
        range.collapse(false);
      }
      range.text = text;
      range.collapse(false);
      range.select();
    } else {
      field.focus();
      var val = field.value;
      var selStart = field.selectionStart;
      var caretPos = selStart + text.length;
      field.value = val.slice(0, selStart) + text + val.slice(field.selectionEnd);
      field.setSelectionRange(caretPos, caretPos);
    }
  }*/

    function generator(){
        $("#generator").show()
        $("#generator").nod([ 'input', 'presence', 'Cannot be empty' ])

        $("#hide-generator").click(function() {
            $("#generator").hide()
        })

  
        $("#create-generator").click(
            function() {
                //addTable($('#generator').serializeObject())
            }
        )

    }

    function addFunctionsToMenu() {
        var f = fnList.list
        addFunctionList(f, $('#side-menu'), 1)


        function addFunctionList(list, elementToBeAppend, lvl) {

            list.forEach(function(fn) {
                console.log(fn)
                if (fn instanceof fnList.SubList) {
                    var sublist = $('<ul>', {
                        click: function() {}
                    })
                    if (lvl == 1) {
                        sublist.addClass("nav nav-second-level collapse")
                    } else {
                        sublist.addClass("nav nav-third-level collapse")
                    }
                    addFunctionList(fn.elems, sublist, lvl + 1)

                    var element = $('<li>', {
                        html: $('<a>' + fn.fn + '<span class="fa arrow"></span>', {
                            click: function() {},
                        })

                    })
                    sublist.appendTo(element)
                    element.appendTo(elementToBeAppend)

                } else {
                    addFunction(fn).appendTo(elementToBeAppend)
                }


            })
            return f
        }

        function addFunction(f) {
            return $('<li>', {
                html: $('<a>', {
                    text: f.fn,
                    click: function() {
                        alert("asdff")
                    },
                })
            });
        }
    }



})
