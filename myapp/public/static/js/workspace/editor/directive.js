define(["codemirror",
    "workspace/carafe-scheme",
    "./service"],
    function(codemirror) {
        
        var app = angular.module('myApp.editor')
        app.directive('codeeditor', function() {
            return {
                restrict: 'A',
                scope: {
                    data: '=',
                    es: "="
                },
                replace: true,
                link: function(scope, elem, attrs) {
                    editor = CodeMirror.fromTextArea($(elem)[0], {
                        mode: "haskell",
                        lineNumbers: true,
                        theme: "elegant",
                    });
                    editor.on("change", function() {
                        scope.es.setEQ({contents:editor.getValue()})
                    });
                    editor.setValue(scope.es.getEQ())
                    scope.$watch("es.equations",function(val,old){editor.setValue(val)})
                    scope.$watch("es.editor.readOnly",function(val,old){editor.setOption("readOnly",val)})
                    $("#editor").css("visibility", "visible");
                }
            }
        })
    });
