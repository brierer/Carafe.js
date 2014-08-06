define([
    "jquery",
    "metisMenu",
    "./evaluator",
    "./eqobj",
    "./widget",
    "./fnList",
    "./generator",
    "filereader",
], function($, metisMenu, evaluator, eqobj, widget, fnList, generator) {



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
        var app = angular.module('myApp', []);
        initComposent(app);
        angular.bootstrap(document, ['myApp'])
        $('#side-menu').metisMenu();
        //evaluator.initPollingGetCalcResult();
    })



    function initComposent(app) {

        generator.init(app);
        widget.init(app);
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

            $('#side-menu').metisMenu();
            // insertAtCursor($(this).attr('title'));
        });


        //$(".btn_eval").click(
        //   function() {
        //      evaluator.eqEvaluation();
        // });
        //$this.find("li").has("ul").children("a").size()
        //$('#side-menu').metisMenu();

    }


    function insertAtCursor(text) {
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
    }



    function addFunctionsToMenu() {}



})
