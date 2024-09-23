
// TODO - Type it better
export const isRowSelected = (row: { id: number }, selectedRows: { id: number }[]) => {
    return selectedRows.filter((r) => r.id === row.id).length > 0;
};