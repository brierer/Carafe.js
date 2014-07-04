define([
  "./eqobj",
], function(eqobj) {



function Table(parse, table, id) {
	this.data = table.data
	this.param = table.p
	this.parse = parse
	this.id = id
	this.width = Math.min(75 * table.data[0].length, 750)
	this.cells = function(row, col, prop) {
		var cellProperties = {};
		cellProperties.readOnly = eqobj.isColReadOnly(row, col, parse, id);
		return cellProperties;
	}
	this.event = {
		afterChange: function(hook) {
			eqobj.changeValue(hook, parse, id);
		},

		afterRemoveRow: function(rowToDelete) {
			eqobj.removeRow(rowToDelete, parse, id);
		}
	}
};

 
Table.fromArray = function(parse, data, id) {
	var table = validateTableWithArray(data)
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
Table.fromNative = function(parse, table, id) {
	return new Table(parse, table, id)
}

return {Table:Table}

})