define(["./widget"], function(widget) {


    var validations = {
        v_integer: {
            fn: valid_integer,
            msg: "This is not valid integer!"
        },
        v_float: {
            fn: valid_float,
            msg: "This is not a valid float!"
        }
    }


    FunctionCreator = function(param) {
        if (!(this instanceof FunctionCreator)) {
            return new FunctionCreator(param);
        }

        this.title = param.title
        if (param.icon != undefined) {
            this.icon = param.icon
        } else {
            this.icon = ""
        }
        this.argument = param.argument
        this.callback = param.callback

    }

    SubList = function(title, fns) {
        if (!(this instanceof SubList)) {
            return new SubList(title, fns);
        }
        this.title = title
        this.fns = fns
        this.icon = "fa-sitemap"
    }

    var list = [
        FunctionCreator({
            'title': 'table',
            'icon': 'fa-table',
            'argument': {
                nbcol: {
                    'title': 'Nb Col',
                    'type': 'number',
                    'validation': validations.v_integer
                },
                nbrow: {
                    'title': 'Nb Row',
                    'type': 'number',
                    'validation': validations.v_integer
                }
            },
            'callback': function(fn) {
                widget.addTable(this.variable_name, fn.nbcol.value)
            }
        }),
        SubList("Math", [FunctionCreator({
                'title': 'sum',
                'argument': [{
                    'title': 'x',
                    'type': 'number',
                    'validation': validations.v_float
                }, {
                    'title': 'y',
                    'type': 'number',
                    'validation': validations.v_float
                }],
                'callback': function() {
                    alert("asdf")
                }
            }),
            SubList("Stats", [FunctionCreator({
                'title': 'sum',
                'argument': [{
                    'title': 'x',
                    'type': 'number',
                    'validation': validations.v_float
                }, {
                    'title': 'y',
                    'type': 'number',
                    'validation': validations.v_float
                }],
                'callback': function() {
                    alert("asdf")
                }
            })])
        ])
    ]




    function valid_float(value) {
        var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
        if (FLOAT_REGEXP.test(value)) {
            return parseFloat(value.replace(',', '.'));
        } else {
            return undefined;
        }
    }

    function valid_integer(value) {
        var REGEXP = /^\-?\d+$/;
        return REGEXP.test(value)
    }


    return {

        list: list
    }
})
