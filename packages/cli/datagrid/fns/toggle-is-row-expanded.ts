import type { ExpandedRows } from "../types";
import { hideExpandedRow } from "./hide-expanded-row";
import { showExpandedRow } from "./show-expanded-row";

export const toggleExpandedRow = (identifier: number | string, expandedRows: ExpandedRows) => {
    if (expandedRows.includes(identifier)) {
        return hideExpandedRow(identifier, expandedRows);
    } else {
        return showExpandedRow(identifier, expandedRows);
    }
};
