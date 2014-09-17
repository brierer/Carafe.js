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
        'highcharts': {
            deps: ['jquery']
        },
        'jquery': {
            deps: ['angular'],
        },
        'filereader': {
            deps: ['jquery'],
        },
        'bootstrap': {
            deps: ['jquery'],
        },
        'validator': {
            deps: ['jquery']
        },
        'metisMenu': {
            deps: ['jquery']
        },
        'jquery-ui': {
            deps: ['jquery']
        },
        'jquery.handsontable.full': {
            deps: ['jquery']
        },
        'bootstrap-iconpicker': {
            deps: ['bootstrap','position-icon']
        },
        'hotkey': {
            deps: ['angular']
        },
        'angular':{
            deps:['jasmine']
        },
        'angular-mock':{
            deps:['angular']
        },
        'angular-cookies.min':{
            deps:['angular'] 
        }
    },

    paths: {
        workspace: '../workspace'
    }
});



// Start the main app logic.
require([
        'angular',
        'workspace/workspace',
    ],
    function() {



    });
