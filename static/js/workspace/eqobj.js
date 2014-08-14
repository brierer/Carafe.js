define(["./mquery"], function(mquery) {

    var eqWrapper = EqWrapper();


    function EqWrapper() {
        var eqObj = null
        return {
            toStr: function() {
                return stringifyEqObj()
            },
            toStrValue: function(val) {
            	return stringifyVal(val)
            },
            setEQ: function(eq) {
                eqObj = eq;
            },
            getEQ: function() {
                return eqObj;
            },
            isColReadOnly: isColReadOnly
        }



        function stringifyEqObj() {
            var text = ""
            for (var eq in eqObj) {
                text += stringifyEquation(eqObj[eq]);
            }
            return text
        }

        function stringifyEquation(eq) {
            return eq[0] + " = " + stringifyVal(eq[1]);
        }

        function stringifyVal(subTree) {
            var s1, v, s2 = ""
            s1 = subTree.s1
            s2 = subTree.s2
            var value = subTree[getValue()]
            if (value[getArray()] !== undefined) {
                v = stringifyArray(value[getArray()])
            } else if (value[getF()] !== undefined) {
                v = stringifyFunction(value[getF()])
            } else if (value.o !== undefined) {
                v = stringifyObj(value.o)
            } else {
                v = stringifyAtomicValue(value.tag, value.contents);
            }
            return s1 + v + s2
        }

        function stringifyArray(contents) {
            var text = ""
            contents.forEach(function(val, i) {
                if (i != 0) {
                    text += ','
                }
                text += stringifyVal(val);;
            })

            return "[" + text + "]";
        }


        function stringifyFunction(f) {

            if (f[getArg()].length == 0) {
                return f.name;
            } else {
                var text = f.name + "("
                var values = f[getArg()]
                values.forEach(function(val, i) {
                    if (i != 0) {
                        text += ','
                    }
                    text += stringifyVal(val);;
                })
                return text + ")";
            }
        }

        function stringifyObj(contents) {
            var text = ""
            contents.forEach(function(content, i) {
                if (i != 0) {
                    text += ','
                }
                tag = content[0];
                value = stringifyVal(content[1]);
                text += tag + ':' + value
            });
            return "{" + text + "}";
        }

        function stringifyAtomicValue(tag, contents) {
            if (tag == getString()) {
                return "\"" + contents + "\""
            } else {
                return contents
            }
        }

    };

    function getArg(){
        return "arg"
    }

    function getValue(){
        return "v"
    }

    function getArray(){
        return "a"
    }
    function getF(){
        return "f"
    }
    function getString(){
        return "Pstring"
    }

    function getBool(){
        return "Pbool"
    }

    function getNum(){
        return "Pnum"
    }
    //search
    function findEQ(name) {
        var eq = eqWrapper.getEQ();
        for (var i = 0; i < eq.length; i++) {
            if (eq[i][0] == name) {
                return eq[i][1]
            }
        }
    }

    function manySearch_(maybe, binds) {
        var m
        if (maybe.isNothing()) {
            m = new M(null)
        } else {
            m = new M(maybe.val())
        }
        binds.forEach(function(fn, i) {

            var b = new M(m.val())
            m.app(isVariable)

            if (m.isNothing()) {
                maybe = b.app(fn);
            } else {
                maybe = new mquery.M(findEQ(m.val().name))
                maybe.app(fn);
            }
            m = maybe
            b = new M(m.val())

        })

        return maybe
    }



    function getDisplayItem_(eqObj, id) {
        var m = new mquery.M(eqObj[0][1])
        m.getFunction("show", 0).fwd([getValue(), getArray()]).select(id)
        return m
    }

    function getFunction(name, i) {
        return function(eqObj) {
            var m = new mquery.M(eqObj)
            m.getFunction(name, i)
            return m.val()
        }

    }

    function getElemOfArray(i) {
        return function(eqObj) {
            var m = new mquery.M(eqObj)
            m.fwd([getValue(), getArray()]).select(i)
            return m.val()
        }
    }



    function isArray(eqObj) {
        var m = new mquery.M(eqObj)
        m.fwd([getValue(), getArray()])
        return m.val()
    }


    function isVariable(eqObj) {
        var m = new mquery.M(eqObj)
        var b = new mquery.M(eqObj)
        m.fwd([getValue(), getF(), getArg()]).compare('length', 0)
        if (!m.maybe().isNothing()) {
            return b.fwd([getValue(), getF()]).val()
        }
        return m.val()
    }


    function isAtomic(eqObj) {
        var m = new mquery.M(eqObj)
        m.getAtomic()
        return m.val()
    }

    function isColReadOnly(row, col, item) {
        var getElemAtCol = manySearch_(item, [getElemOfArray(col)])
        if (getElemAtCol.isNothing()) {
            return true
        }
        validArray = manySearch_(getElemAtCol, [isArray]);

        if (!validArray.isNothing()) {
            if (validArray.val().length - 1 < row) {
                return false
            } else {
                return manySearch_(getElemAtCol, [getElemOfArray(row), isAtomic]).isNothing()
            }

        }

        return true

    }

    //UPDATE

    function addOrChangeValue(hook, item) {

        var getCol = manySearch_(item, [getElemOfArray(hook.col), isArray])
        addOrChangeAtomicValue(hook, getCol.val())
    }



    function addOrChangeAtomicValue(hook, subeqObj, eqObj) {
        if (isVariable(subeqObj)) {
            addOrChangeAtomicValue(hook, findEQ(subeqObj[getValue()][getF()].name));
        } else {
            if (false) {
                addAtomicValue(hook, subeqObj)
            } else {
                if (subeqObj[hook.row] != undefined) {
                    if (isVariable(subeqObj[hook.row])) {
                        var valueToChange = M(findEQ(subeqObj[hook.row][getValue()][getF()].name)[getValue()]);
                        changeVariable(hook.new, valueToChange);
                    } else {
                        var valueToChange = subeqObj[hook.row][getValue()]
                        changeAtomic(hook.new, valueToChange)
                    }
                } else {
                    var nb = hook.row - subeqObj.length
                    for (var i = 0; i < nb; i++) {
                        pushVariable(hook.row, subeqObj, createEmptyVal())
                    }
                    addAtomicValue(hook, subeqObj)
                }
            }
        }
    }



    function changeVariable(value, exp) {
        val = exp.val()
        if (!(exp.fwd([getF(), getArg()]).compare('length', 0).isNothing())) {
            var valueToChange = M(findEQ(val[getF()].name)[getValue()]);
            changeVariable(value, valueToChange);
        } else {
            changeAtomic(value, exp.val())
        }
    }



    function changeAtomic(newValue, val) {
        var value = {}
        if (newValue == "false" || newValue == "true") {
            value = changePbool(newValue, val)
        } else if (newValue != "" && !isNaN(newValue)) {
            value = changePnum(newValue, val);
        } else {
            value = changePstring(newValue, val);
        }
    }

    function changePbool(value, subeqObj) {
        subeqObj.tag = getBool()
        if (value == "false")
            subeqObj.contents = false
        else {
            subeqObj.contents = true
        };
    }

    function changePstring(value, subeqObj) {
        subeqObj.tag = getString()
        subeqObj.contents = value
    }

    function changePnum(value, subeqObj) {
        subeqObj.tag = getNum()
        subeqObj.contents = Number(value)
    }


    //REMOVE

    function removeRow(row, item) {

        data = manySearch_(item, [isArray])
        if (!data.isNothing()) {
            data.val().forEach(function(val, i) {
                valueToDelete = new M(val);
                if (!valueToDelete.fwd([getValue()]).isNothing()) {
                    removeFromVariable(row, valueToDelete);

                }
            })
        }
    }


    function removeFromVariable(row, exp) {
        var val = exp.val()

        if (!(exp.fwd([getF(), getArg()]).compare('length', 0).isNothing())) {
            var valueToChange = M(findEQ(val[getF()].name)[getValue()]);
            removeFromVariable(row, valueToChange);
        } else {
            val[getArray()].splice(row - 1, 1);
        }
    }

    function removeCol(col, exp) {
        var val = exp.val()

        if (!(exp.fwd([getF(), getArg()]).compare('length', 0).isNothing())) {
            var valueToChange = M(findEQ(val[getF()].name)[getValue()]);
            removeCol(col, valueToChange);
        } else {
            val[getValue()][getArray()].splice(col, 1);
        }
    }

    //INSERT


    function addVariable(row, exp, variable) {
        var val = exp.val()

        if (!(exp.fwd([getF(), getArg()]).compare('length', 0).isNothing())) {
            var valueToChange = M(findEQ(val[getF()].name)[getValue()]);
            removeFromVariable(row, valueToChange);
        } else {
            val[getArray()].splice(row, 0, variable);
        }
    }

    function pushVariable(row, exp, variable) {
        exp.push(variable)
    }



    function addRow(exp, row) {
        data = manySearch_(exp, [isArray])
        if (!data.isNothing()) data.val().forEach(function(val, i) {
            valueToDelete = new M(val);
            if (!valueToDelete.isNothing()) {
                back = new M(val)
                if (valueToDelete.fwd([getValue(), getF(), getArg()]).compare("length", 0)) {
                    var valueToChange = M(findEQ(back.fwd([getValue(), getF(), 'name']).val())[getValue()]);
                    //valueToChange.log()
                    addVariable(row, valueToChange, createEmptyVal());
                } else {
                    val[getValue()][getArray()].splice(row, 0, createEmptyVal());
                }
            }
        })

        //M(findEQ("y")).log()
    }

    function addCol(exp, col) {
        exp.val()[getValue()][getArray()].splice(col, 0, createArray([]));
    }

    function addAtomicValue(hook, subeqObj) {
        var value = {}
        if (hook.new == "false" || hook.new == "true") {
            value = createVal(hook.new, subeqObj, changePbool)
        } else if (hook.new != "" && !isNaN(hook.new)) {
            value = createVal(hook.new, subeqObj, changePnum)
        } else {
            value = createVal(hook.new, subeqObj, changePstring)
        }

        var diff = hook.row - subeqObj.length - 1
        while (diff >= 0) {
            var empty = createVal("", subeqObj, changePstring)
                //  subeqObj.push(empty);
            diff--
        }

        subeqObj.push(value);
    }


    function createEmptyVal() {
        return createString("");
    }

    function createVal(hook, subeqObj, fn) {
        var value = {}
        value[getValue()] = {};
        fn(hook, value[getValue()])
        value.s1 = ""
        value.s2 = ""
        return value
    }


    function addEq(name, value) {
        eqs = eqWrapper.getEQ();
        eqs[eqs.length - 1][1].s2 = "\n";
        eqs.push([name, value])
        return value
    }

    function createString(val) {
        var value = {}
        value[getValue()] = {
            tag: "Pstring",
            contents: val
        };
        value.s1 = ""
        value.s2 = ""
        return value
    }

    function createFunction(name, args) {
        var v = {}
        var f = {}
        f = {
            f: {
                name: name,
                arg: args
            }
        }
        v = {
            s1: "",
            v: f,
            s2: ""
        }
        return v
    }

    function createMatrix(col, row) {
        var arr = []
        for (var i = 0; i < col; i++) {
            arr.push(createArray([]));
        }
        var v = {
            a: arr
        }
        return {
            s1: "",
            v: v,
            s2: ""
        }
    }

    function createArray(val) {
        var arr = val
        var v = {
            a: arr
        }
        return {
            s1: "",
            v: v,
            s2: ""
        }
    }

    function createObject(attr) {
        return {
            s1: "",
            v: {
                o: attr
            },
            s2: ""
        }
    }

    function addShow(eq) {
        eqWrapper.getEQ()[0][1][getValue()][getF()][getArg()][0][getValue()][getArray()].push(createFunction(eq, []));
    }

    
    return {
        eqWrapper: eqWrapper,
        addOrChangeValue: addOrChangeValue,
        removeRow: removeRow,
        isColReadOnly: isColReadOnly,
        getDisplayItem: getDisplayItem_,
        getFunction: getFunction,
        manySearch: manySearch_,
        addRow: addRow,
        addCol: addCol,
        addShow: addShow,
        addEq: addEq,
        removeCol: removeCol,
        createFunction: createFunction,
        createMatrix: createMatrix,
        createObject: createObject,
        createArray: createArray,
        createString:createString,
    }
})
