define(["./widget"], function(widget) {


    var validations = {
        v_integer: {
            fn: valid_integer,
            msg: "This is not valid integer!"
        },
        v_float: {
            fn: valid_float,
            msg: "This is not a valid float!"
        },
        v_file: {
            fn: valid_file,
            msg: "This is not a valid file!"
        },
        v_url: {
            fn: valid_url,
            msg: "This is not a valid url!"
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
        SubList("Table", [
            FunctionCreator({
                'title': 'New Table',
                'icon': 'fa-table',
                'argument': {
                    nbcol: {
                        'title': 'Nb Col',
                        'validation': validations.v_integer
                    },
                    nbrow: {
                        'title': 'Nb Row',
                        'validation': validations.v_integer
                    }
                },
                'callback': function(fn) {
                    console.log(this)
                    widget.addTable(this.variable_name, fn.nbcol.value)
                }
            }),
            FunctionCreator({
                'title': 'Table from CSV FILE',
                'icon': 'fa-table',
                'argument': {
                    file: {
                        'title': 'File',
                        'type': 'file',
                        'validation': validations.v_file
                    }
                },
                'callback': function(fn) {
                    var reader = new FileReader()
                    var variable_name = this.variable_name
                    reader.onload = function(e) {
                        var text = reader.result;
                        console.log(JSON.stringify(processData(text)))
                        widget.addTableWithData(variable_name, processData(text))
                    }
                    reader.readAsBinaryString(this.file)

                }
            }),
            FunctionCreator({
                'title': 'Table from CSV URL',
                'icon': 'fa-table',
                'argument': {
                    URL: {
                        'title': 'URL',
                        'validation': validations.v_url
                    }
                },
                'callback': function(fn) {
                    var reader = new FileReader()
                    var variable_name = this.variable_name
                    reader.onload = function(e) {
                        var text = reader.result;
                        console.log(JSON.stringify(processData(text)))
                        widget.addTableWithData(variable_name, processData(text))
                    }
                    reader.readAsBinaryString(this.file)

                }
            })
        ]),
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


    function valid_file(value) {
        console.log("YO")
        console.log((value.srcElement || value.target).files[0])
        return value
    }

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


    function valid_url(value) {
        var parser = document.createElement('a');
        parser.href = value;
        return (parser.hostname != null)
 
    }


    function read_file(file) {
        console.log(JSON.stringify(file))
    }

    function processData(allText) {
        var allTextLines = allText.split(/\r\n|\n/);
        var headers = allTextLines[0].split(',');
        var lines = [];

        for (var i = 1; i < allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
            if (data.length == headers.length) {

                var tarr = [];
                for (var j = 0; j < headers.length; j++) {
                    tarr.push(data[j]);
                }
                lines.push(tarr);
            }
        }
        return lines
    }

    return {

        list: list
    }
})
