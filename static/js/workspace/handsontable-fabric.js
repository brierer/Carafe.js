function HDT_fabric(table) {

	this.options = {
		data: table.data,
		colHeaders: table.param.col == null ? true : table.param.col,
		minSpareRows: 1,
		contextMenu: true,
		stretchH: 'all',
		width: Math.min(75 * table.data[0].length, 750),
		cells: table.cells,
		afterChange: afterChange,
		afterRemoveRow: afterRemoveRow

	}

	//EVENT
	function afterRemoveRow(row) {
		var selection = this.getSelected()
		var rowBegin = selection[0]
		var rowEnd = selection[2]
		//Delete rows selection
		for (var i = rowBegin; i <= rowEnd; i++) {
			var gt = row >= this.countRows()
			var rowToDelete = gt ? row : row + 1
			table.event.afterRemoveRow(rowToDelete);
		}
		updateEditorText()
	}

	function afterChange(hooks) {
		var handsontable = this
		if (hooks != null) {
			hooks.forEach(function(hook, i) {
				changeCell(handsontable, hook)
			})
		}
	}
	//HELPER
	function changeCell(handsontable, hook) {
		var row = hook[0];
		var col = hook[1];
		var old_value = hook[2]
		var new_value = hook[3]
		if (!(new_value == null || new_value == "" && handsontable.getDataAtCol(col).length - 1 == row)) {
			convertNullBeforeEndToEmptyString(handsontable, row, col)
			table.event.afterChange({
				'row': row,
				'col': col,
				'old': old_value,
				'new': new_value
			});

			updateEditorText()
			setEmptyStringNull(handsontable)
		}

	}

	function convertNullBeforeEndToEmptyString(table, row, col) {
		for (var i = 0; i < row; i++) {
			if (table.getDataAtCell(i, col) == null && i < table.countRows() - 1) {
				table.setDataAtCell(i, col, "")
			}
		}
	}


	function setEmptyStringNull(table) {
		var cells = table.getDataAtRow(table.countRows() - 1);
		cells.forEach(function(val, i) {
			if (val == "") {
				table.setDataAtCell(table.countRows() - 1, i, null)
			}
		})
	}
}