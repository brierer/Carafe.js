requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'static/js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    shim: {
        'vendor/d3.layout.min': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['vendor/d3.min', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
        },
        'rickshaw': {
            deps: ['vendor/d3.layout.min', "bootstrap"],
        }
    },

    paths: {
        workspace: '../workspace'
    }
});

// Start the main app logic.
requirejs([
        'jquery',
        'jquery-ui',
        'bootstrap',
        'codemirror',
        'jquery.handsontable.full',
        'vendor/d3.layout.min',
        'vendor/d3.min',
        'rickshaw',
        'workspace/carafe-scheme',
        'workspace/chart',
        'workspace/evaluator',
        'workspace/eqobj',
        'workspace/handsontable-fabric',
        'workspace/rickshaw-fabric',
        'workspace/table',
        'workspace/validator',
        'workspace/widget',
        'workspace/workspace',
        'jquery.mockjax',
        'workspace/mock',
    ],
    function() {

    });