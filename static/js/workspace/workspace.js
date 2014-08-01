define([
    "jquery",
    "./evaluator",
    "./eqobj",
    "./widget",
    "./fnList",
    "./generator",
    "filereader",
    "metisMenu",
], function($, evaluator, eqobj, widget, fnList, generator) {





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

        // Create the XHR object.
        function createCORSRequest(method, url) {
            var xhr = new XMLHttpRequest();
            if ("withCredentials" in xhr) {
                // XHR for Chrome/Firefox/Opera/Safari.
                xhr.open(method, url, true);
            } else if (typeof XDomainRequest != "undefined") {
                // XDomainRequest for IE.
                xhr = new XDomainRequest();
                xhr.open(method, url);
            } else {
                // CORS not supported.
                xhr = null;
            }
            return xhr;
        }

        // Helper method to parse the title tag from the response.
        function getTitle(text) {
            return text.match('<title>(.*)?</title>')[1];
        }

        // Make the actual CORS request.
        function makeCorsRequest() {
            // All HTML5 Rocks properties support CORS.
            var url = 'http://www.quandl.com/api/v1/datasets/WORLDBANK/CAN_SP_DYN_SMAM_FE.csv?trim_start=1971-12-31&trim_end=2006-12-31&collapse=annual';

            var xhr = createCORSRequest('GET', url);
            if (!xhr) {
                alert('CORS not supported');
                return;
            }

            // Response handlers.
            xhr.onload = function() {
                var text = xhr.responseText;
              
                alert('Response from CORS request to ' + url + ': ' + text);
            };

            xhr.onerror = function() {
                alert('Woops, there was an error making the request.');
            };

            xhr.send();
        }

        makeCorsRequest();
        initComposent();
        evaluator.initPollingGetCalcResult();
    })



    function initComposent() {

        $('#side-menu').metisMenu();

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



    function addFunctionsToMenu() {}



})
