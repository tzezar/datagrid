import type { BaseColumn } from "../types";
import { getOffsetLeft } from "./get-offset-left";
import { getOffsetRight } from "./get-offset-right";

export const applyOffset = <T>(columns: BaseColumn<T>[]) => {
    for (const column of columns) {
        if (column.pinned?.position == 'left') {
            column.pinned.offset = getOffsetLeft(column.id, columns);
        } else if (column.pinned?.position == 'right') {
            column.pinned.offset = getOffsetRight(column.id, columns);
        }
    }
    return columns;
};
