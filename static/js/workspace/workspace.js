define([
    "jquery",
    "./evaluator",
    "./eqobj",
    "./widget",
    "./fnList",
    "./generator",
    "metisMenu",
], function($, evaluator, eqobj, widget, fnList, generator) {

    var myApp = angular.module('myApp', []);
    myApp.factory('Data', function() {
        return {
            message: "salut",
        };
    });

    myApp
        .controller('FirstCtrl', ['$scope', 'Data',
            function($scope, Data) {
                $scope.data = Data;
                Data.message = "salut"
            }
        ]);

    myApp.controller('SecondCtrl', ['$scope', 'Data',
        function($scope, Data) {
            $scope.data = Data;
            $scope.reversedMessage = function() {
                return $scope.data.message.split("").reverse().join("");
            };
        }
    ]);

    angular.bootstrap(document, ['myApp'])



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
        generator.init();
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



    function addFunctionsToMenu() {
        fnList.toHtml($("#side-menu"))
    }



})
