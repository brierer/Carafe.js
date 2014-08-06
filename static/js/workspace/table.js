define([
    "./eqobj",
    "./mquery"
], function(eqobj, mquery) {



    function Table(exp, prettyData, table, id) {
        this.data = table.data
        this.prettyData = prettyData
        this.param = table.p
        this.parse = exp
        this.id = id
        this.width = Math.min(75 * table.data[0].length, 750)
        this.cells = function(row, col, prop) {
            var cellProperties = {};
            cellProperties.readOnly = eqobj.isColReadOnly(row, col, exp.copy());
            return cellProperties;
        }
        this.event = {
            afterChange: function(hook) {
                eqobj.addOrChangeValue(hook, exp.copy());
            },

            afterRemoveRow: function(rowToDelete) {
                eqobj.removeRow(rowToDelete, exp.copy());
            },
            afterRemoveCol: function(colToDelete) {
                eqobj.removeCol(colToDelete, exp.copy());
            },
            afterCreateRow: function(index, number) {
                for (var i = index; i < index + number; i++) {
                    eqobj.addRow(exp.copy(), index)
                }
            },
            afterCreateCol: function(index, number) {
                for (var i = index; i < index + number; i++) {
                    eqobj.addCol(exp.copy(), index)
                }
            }
        }
        console.log(this.param)
    };



    Table.fromArray = function(exp, data, id, header) {
        var table = validateTableWithArray(data, header)
        if (id != null) {
            exp = eqobj.getDisplayItem(exp, id)
        } else {
            exp = M(exp)
        }
        var table = new Table(eqobj.manySearch(exp, [eqobj.getFunction("table", 0)]), table, id)

        data.forEach(function(row, i) {
            row.forEach(function(cell, y) {
                var hook = {
                    'row': i,
                    'col': y,
                    'old': "",
                    'new': data[i][y]
                }
                table.event.afterChange(hook)
            })
        })

        return table

        function validateTableWithArray(data, header) {
            (header === undefined) ? header = false : header;
            var table = {
                data: header ? data.slice(1, data.length) : data,
                p: {
                    col: header ? data.shift() : true
                }
            }

            return table;
        }
    }
    Table.fromNative = function(exp, table, id) {
        var m = searchTable(exp, id)
        var prettyData = eqobj.eqWrapper.toStrValue(m.val())
        return new Table(m, prettyData, table, id)
    }

    function searchTable(exp, id) {
        var item = eqobj.getDisplayItem(exp, id)
        return eqobj.manySearch(item, [eqobj.getFunction("table", 0)])

    }



    return {
        Table: Table
    }

})
