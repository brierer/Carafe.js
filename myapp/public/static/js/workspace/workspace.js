define([
    "jquery",
    "metisMenu",
    "angular-cookies.min",
    "./carafeservice",
    "./widget/controller",
    "./editor/controller",
    "./wizard/controller"
], function($, metisMenu) {
    $(function() {
        var app = angular.module('myApp', [
            'ngCookies',
            'myApp.carafe',
            'myApp.editor',
            'myApp.widget',
            'myApp.wizard',
        ]);
        app.run(function($rootScope, $http, $cookies) {
            $rootScope.ready = false;
            // set the CSRF token here
            $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;

        })
        initComposent();
        angular.bootstrap(document, ['myApp'])
        $('#side-menu').metisMenu();
    })

    function initComposent() {


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
})
