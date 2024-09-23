import type { ExpandedRows } from "../types";

export const showExpandedRow = (rowId: number | string, expandedRows: ExpandedRows) => {
    return [...expandedRows, rowId];
};
