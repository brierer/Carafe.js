define(["codemirror",
    "workspace/carafe-scheme"],
    function(codemirror) {
        
        var app = angular.module('myApp.editor', [])
        app.directive('codeeditor', function() {
            return {
                restrict: 'A',
                scope: {
                    data: '='
                },
                replace: true,
                link: function(scope, elem, attrs) {
                    editor = CodeMirror.fromTextArea($(elem)[0], {
                        mode: "haskell",
                        lineNumbers: true,
                        theme: "elegant",
                    });
                    editor.on("change", function() {
                        scope.data()
                    });
                    $("#editor").css("visibility", "visible");
                }
            }
        })
    });
