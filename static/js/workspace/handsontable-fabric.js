function HDT_fabric(table){

	this.options={
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
  function afterRemoveRow(hook) {
			var gt = hook >= this.countRows()
			var rowToDelete = gt ? hook : hook + 1

			table.event.afterRemoveRow(rowToDelete);
			updateEditorText()
		}	 

  function afterChange(hooks){
    var handsontable = this
      if (hooks != null) {
        hooks.forEach(function(hook, i) {
          if (!(hook[3] == null || hook[3] == "" && handsontable.getDataAtCol(hook[1]).length - 1 == hook[0])) {
            convertNullBeforeEndToEmptyString(handsontable, hook)
            table.event.afterChange({
              'row': hook[0],
              'col': hook[1],
              'old': hook[2],
              'new': hook[3]
            });

            updateEditorText()
            setEmptyStringNull(handsontable)
          }
        })
      }
  }
}
  //HELPER
  function convertNullBeforeEndToEmptyString(table, hook) {
    for (var i = 0; i < hook[0]; i++) {
      if (table.getDataAtCell(i, hook[1]) == null && i < table.countRows() - 1) {
        table.setDataAtCell(i, hook[1], "")
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