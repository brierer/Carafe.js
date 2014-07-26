define([
	"./eqobj",
	"./mquery"
], function(eqobj, mquery) {



	function Table(exp, table, id) {
		this.data = table.data
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
				for (var i=index; i<index+number ;i++){
					eqobj.addRow(exp.copy(), index)
				}
			},
			afterCreateCol: function(index,number) {
				for (var i=index; i<index+number ;i++){
					eqobj.addCol(exp.copy(), index)
				}
			}
		}
	};
	/*function removeFromVariable(row, exp) {
		var val = exp.val()
		if (!(exp.fwd(['f', 'arg']).compare('length', 0).isNothing())) {
			var valueToChange = findEQ(val.f.name).v;
			removeFromVariable(row, valueToChange, eqObj);
		} else {
			exp.val().a.splice(row - 1, 1);
		}
	}*/


	Table.fromArray = function(exp, data, id) {
		var table = validateTableWithArray(data)
		var exp = eqobj.getDisplayItem(exp, id)
		return new Table(parse, table, id)

		function validateTableWithArray(data) {
			var table = {
				data: data,
				p: {
					col: []
				}
			}
			$.each(table.data, function(i, col) {
				table.p.col = true;
			});
			return table;
		}
	}
	Table.fromNative = function(exp, table, id) {
		var m = searchTable(exp, id)
		console.log(m.val())
		return new Table(m, table, id)
	}

	function searchTable(exp, id) {
		var item = eqobj.getDisplayItem(exp, id)
		return eqobj.manySearch(item, [eqobj.getFunction("table", 0)])

	}



	return {
		Table: Table
	}

})