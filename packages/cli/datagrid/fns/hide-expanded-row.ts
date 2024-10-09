import type { ExpandedRows } from "../types";

export const hideExpandedRow = (rowId: number | string, expandedRows: ExpandedRows) => {
    return expandedRows.filter((i) => i !== rowId);
};