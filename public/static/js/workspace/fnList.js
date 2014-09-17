define(["bootstrap-iconpicker"], function(iconpicker) {

    Variable = function(name) {
        if (!(this instanceof Variable)) {
            return new Variable(name);
        }
        this.txt = name
    }

    Default_fn = function(name, arg) {
        if (!(this instanceof Default_fn)) {
            return new Default_fn(name, arg);
        }
        var txt = ""
        if (name != null)
            txt = name
        if (arg != null) {
            if (name != null)
                txt += "("
            else
                txt += "["
            arg.forEach(function(e, i) {
                if (e.txt != null) {
                    txt += e.txt
                } else {
                    txt += JSON.stringify(e)
                }
                if (i != arg.length - 1)
                    txt += ','
            })
            if (name != null)
                txt += ")"
            else
                txt += "]"
        }
        this.txt = txt
    }



    var validations = {
        v_integer: {
            fn: valid_integer,
            msg: "This is not valid integer!"
        },
        v_float: {
            fn: valid_float,
            msg: "This is not a valid float!"
        },
        v_char: {
            fn: valid_char,
            msg: "This is not a valid char!"
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

    Argument = function(title, type, validation, value, param) {
        if (!(this instanceof Argument)) {
            return new Argument(title, type, validation, value, param);
        }
        this.title = title
        this.type = type
        this.validation = validation
        this.value = value
        this.param = (param == null) ? {} : param
    }

    SubList = function(title, icon, fns) {
        if (!(this instanceof SubList)) {
            return new SubList(title, icon, fns);
        }
        this.title = title
        this.fns = fns
        this.icon = icon
    }

    var list = [
        SubList("Table", "fa-table", [
            FunctionCreator({
                'title': 'New Table',
                'icon': 'fa-table',
                'argument': {
                    nbcol: Argument('Nb col', null, validations.v_integer),
                },
                'callback': function() {
                    this.widget.addTable(this.fnSelected.variable_name, this.inputs.nbcol.value)
                }
            }),
            FunctionCreator({
                'title': 'Table from CSV FILE',
                'icon': 'fa-file-text',
                'argument': {
                    file: Argument('File', 'file', validations.v_file),
                    header: Argument('First Row Header', 'checkbox', null),
                    separator: Argument('separator', null, validations.v_char, ","),
                },
                'callback': function() {
                    var reader = new FileReader()
                    var variable_name = this.fnSelected.variable_name
                    var widget = this.widget
                    var inputs = this.inputs
                    reader.onload = function(e) {
                        var text = reader.result;
                       // widget.addTableWithData(variable_name, processData(text), inputs.header.value)
                    }
                    reader.readAsBinaryString(this.fnSelected.file)

                }
            }),
            FunctionCreator({
                'title': 'Table from CSV URL',
                'icon': 'fa-external-link-square',
                'argument': {
                    url: Argument('url', null, validations.v_url),
                    header: Argument('First Row Header', 'checkbox', null),
                    separator: Argument('separator', null, validations.v_char, ",")
                },
                'callback': function() {
                    processURL(this.fnSelected.variable_name, this.inputs, this.widget)
                }
            }),
            FunctionCreator({
                'title': 'Icon Table',
                'icon': 'fa-smile-o',
                'argument': {
                    icon: Argument('fa-adjust', null, null, 'fa-angle-down', {
                        style: 'icp icp-auto'
                    }),
                    data: Argument('Data', null, null),
                    //iconTrue: Argument('Icon False', null, null),
                    //condition:Argument('Condition', null, null),
                    text: Argument('Text', null, null),
                },
                'callback': function() {
                    var i = this.inputs
                    var icon = i.icon.value
                    var text = i.text.value
                    var data = i.data.value
                    var f1 = Default_fn(null, [Default_fn("icon", ["smile-o"]), Default_fn("pourcentage", [Variable(data)])])
                    f1.txt = "[" + f1.txt + "]"
                    var f = Default_fn("table", [

                        f1, {
                            col: [text],
                            grid: 0,
                            align: "center"
                        }
                    ]).txt
                    this.widget.addToEditorText(this.fnSelected.variable_name, f, true)
                }
            })
        ]),
        SubList("Array", "fa-list", [{}]),
        SubList("Filter", "fa-filter", [{}]),
        SubList("Math", "fa-plus", [
            FunctionCreator({
                'title': 'sum',
                'argument': [
                    Argument('x', null, validations.v_float),
                    Argument('y', null, validations.v_file)
                ],
                'callback': function() {
                    this.widget.addToEditorText(null, input_to_fn("sum", this.inputs))
                }
            })
        ]),
        SubList("Plot", "fa-bar-chart-o", [{}]),
        SubList("Statistics", "fa-gear", [
            FunctionCreator({
                'title': 'Descriptive',
                'argument': [
                    Argument('Data', null, null),
                ],
                'callback': function() {
                    this.widget.addToEditorText(null, input_to_fn("descriptive", this.inputs))
                }
            }),
            FunctionCreator({
                'title': 'Mean',
                'argument': [
                    Argument('Data', null, null),
                ],
                'callback': function() {
                    this.widget.addToEditorText(this.fnSelected.variable_name, input_to_fn("mean", this.inputs))
                }
            }),
            FunctionCreator({
                'title': 'Variance',
                'argument': [
                    Argument('data', null, null),
                ],
                'callback': function() {
                    this.widget.addToEditorText(null, input_to_fn("mean", this.inputs))
                }
            }),
            FunctionCreator({
                'title': 'Mode',
                'argument': [
                    Argument('data', null, null),
                ],
                'callback': function() {
                    this.widget.addToEditorText(null, input_to_fn("mean", this.inputs))
                }
            }),
            FunctionCreator({
                'title': 'Max',
                'argument': [
                    Argument('data', null, null),
                ],
                'callback': function() {
                    this.widget.addToEditorText(null, input_to_fn("mean", this.inputs))
                }
            }),
            FunctionCreator({
                'title': 'Min',
                'argument': [
                    Argument('data', null, null),
                ],
                'callback': function() {
                    this.widget.addToEditorText(null, input_to_fn("mean", this.inputs))
                }
            }),
            SubList("Tests", "fa-sitemap", [{}]),
        ]),
        SubList("Finance", "fa-usd", [{}]),
        SubList("Date", "fa-calendar", [{}]),
        SubList("Text", "fa-italic", [{}]),

    ]


    function valid_file(value) {
        return value
    }

    function valid_float(value) {
        if (value[0] == "=") return value
        var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
        if (FLOAT_REGEXP.test(value)) {
            return parseFloat(value.replace(',', '.'));
        } else {
            return undefined;
        }
    }

    function valid_char(value) {
        if (value.length == 1) {
            return value
        } else {
            return undefined;
        }
    }

    function valid_integer(value) {
        if (value[0] == "=") return value
        var REGEXP = /^\-?\d+$/;
        return REGEXP.test(value)
    }


    function valid_url(value) {
        var REGEXP = new RegExp(
            "^" +
            // protocol identifier
            "(?:(?:https?|ftp)://)" +
            // user:pass authentication
            "(?:\\S+(?::\\S*)?@)?" +
            "(?:" +
            // IP address exclusion
            // private & local networks
            "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
            "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
            "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
            // IP address dotted notation octets
            // excludes loopback network 0.0.0.0
            // excludes reserved space >= 224.0.0.0
            // excludes network & broacast addresses
            // (first & last IP address of each class)
            "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
            "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
            "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
            "|" +
            // host name
            "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
            // domain name
            "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
            // TLD identifier
            "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
            ")" +
            // port number
            "(?::\\d{2,5})?" +
            // resource path
            "(?:/\\S*)?" +
            "$", "i"
        );
        return REGEXP.test(value)
    }


    function read_file(file) {
        console.log(JSON.stringify(file))
    }

    function input_to_fn(name, arg) {
        var txt = name + "("
        arg.forEach(function(e, i) {
            txt += e.value
            if (i != arg.length - 1)
                txt += ','
        })
        txt += ')'
        return txt
    }

    function default_fn(name, arg) {
        var txt = name + "("
        arg.forEach(function(e, i) {
            txt += JSON.stringify(e)
            if (i != arg.length - 1)
                txt += ','
        })
        txt += ')'
        return txt
    }

    function processURL(variable_name, fn, widget) {

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



        // Make the actual CORS request.
        function makeCorsRequest() {
            // All HTML5 Rocks properties support CORS.
            var url = fn.url.value

            var xhr = createCORSRequest('GET', url);
            if (!xhr) {
                alert('CORS not supported');
                return;
            }

            // Response handlers.
            xhr.onload = function() {
                var text = xhr.responseText;
                //widget.addTableWithData(variable_name, processData(text), fn.header.value)
            };

            xhr.onerror = function() {
                alert('Woops, there was an error making the request.');
            };

            xhr.send();
        }

        makeCorsRequest();
    }

    function processData(allText) {
        var allTextLines = allText.split(/\r\n|\n/);
        var headers = allTextLines[0].split(',');
        var lines = [];

        for (var i = 0;
            (i < allTextLines.length) && (i < 100); i++) {
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
