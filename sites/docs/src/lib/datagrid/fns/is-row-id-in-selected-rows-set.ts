export const isRowIdInSelectedRowsSet = (rowId: number, selectedRows: Set<number>) => {
    return selectedRows.has(rowId)
}