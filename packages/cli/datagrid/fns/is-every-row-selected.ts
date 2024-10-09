export const isEveryRowSelected = (selectedRows: unknown[], data: unknown[]) => {
    return selectedRows.length === data.length;
};