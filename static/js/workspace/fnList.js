define([], function() {
    Function = function(name) {
        if (!(this instanceof Function)) {
            return new Function(name);
        }
        this.fn = name
    }

    SubList = function(name, elems) {
        if (!(this instanceof SubList)) {
            return new SubList(name, elems);
        }
        this.fn = name
        this.elems = elems
    }

    list = [
        Function("table"),
        SubList("Math", [Function("sum"),
            SubList("Stats", [Function("table"),SubList("Math", [Function("sum")])])
        ])
    ]
    return {
        list: list,
        SubList: SubList
    }
})
