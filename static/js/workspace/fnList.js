define(["./generator"], function(generator) {
    FunctionCreator = function(param) {
        if (!(this instanceof FunctionCreator)) {
            return new FunctionCreator(param);
        }
        this.title = param.title
        this.arg = param.arg
        this.callback = param.callback
        this.param = param
    }

    SubList = function(title, fns) {
        if (!(this instanceof SubList)) {
            return new SubList(title, fns);
        }
        this.title = title
        this.fns = fns
    }

    list = [
        FunctionCreator({
            'title': 'table',
            'arg': [{
                'title': 'Nb Col',
                'type': 'number',
                'validation': {
                    required: true
                }
            }],
            'callback': function() {
                alert("asdf")
            }
        }),
        SubList("Math", [FunctionCreator({
                'title': 'sum'
            }),
            SubList("Stats", [FunctionCreator({
                'title': 'corr'
            }), SubList("Math", [FunctionCreator({
                'title': 'sum',
                'arg': [{
                    'title': 'Nb Col',
                    'type': 'number',
                    'validation': {
                        required: true,
                        number: true
                    }
                }],
                'callback': function() {
                    alert("asdf")
                }
            })])])
        ])
    ]

    toHtml = function(elementToBeAppend) {
        addFunctionCreatorList(list, elementToBeAppend, "nav nav-second-level collapse")


        function addFunctionCreatorList(list, elementToBeAppend, classToAppend) {
            var f = list
            list.forEach(function(el) {
                if (el instanceof SubList) {
                    var sublist = $('<ul>', {
                        click: function() {}
                    })

                    sublist.addClass(classToAppend)

                    sublist.addClass("nav nav-third-level collapse")

                    addFunctionCreatorList(el.fns, sublist, "nav nav-third-level collapse")

                    var element = $('<li>', {
                        html: $('<a>' + el.title + '<span class="fa arrow"></span>', {
                            click: function() {},
                        })

                    })
                    sublist.appendTo(element)
                    element.appendTo(elementToBeAppend)

                } else {
                    addFunctionCreator(el).appendTo(elementToBeAppend)
                }


            })
            return f
        }

        function addFunctionCreator(f) {
            return $('<li>', {
                html: $('<a>', {
                    text: f.title,
                    click: function() {
                        generator.update(f)
                    },
                })
            });
        }

    }

    return {
        toHtml: toHtml
    }
})
