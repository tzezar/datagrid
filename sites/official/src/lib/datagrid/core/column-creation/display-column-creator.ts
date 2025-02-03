import { DEFAULT_COLUMN_SIZE } from "../defaults";
import type { DisplayColumn } from "../types";
import { isColumnFilterable, isColumnSortable, isColumnVisible } from "./column-methods";
import type { CreateDisplayColumnProps } from "./types";

const createDisplayColumnColumnId = ({ columnId, header }: { columnId?: string, header?: string }): string => {
  if (columnId) return columnId;
  if (header) return header.toLowerCase().replace(/\s+/g, "_"); // Fallback to a sanitized header
  throw new Error("A valid columnId, header must be provided to create a group column.");
}

export function createDisplayColumn<TOriginalRow extends Record<string, any>, TMeta>(
  { header, cell, columnId, _meta, options, state, align, ...rest }: CreateDisplayColumnProps<TOriginalRow, TMeta>
): DisplayColumn<TOriginalRow, TMeta> {

  const computedColumnId = createDisplayColumnColumnId({ header, columnId });

  return {
    type: 'display',
    header,
    columnId: computedColumnId,
    parentColumnId: rest.parentColumnId || null,
    cell,
    options: {
      searchable: null,
      groupable: null,
      sortable: null,
      filterable: null,
      pinnable: options?.pinnable ?? true,
      moveable: options?.moveable ?? true,
      hideable: options?.hideable ?? true,
    },
    state: {
      size: state?.size ?? DEFAULT_COLUMN_SIZE,
      visible: state?.visible ?? true,
      pinning: {
        position: state?.pinning?.position ?? 'none',
        offset: 0
      }
    },
    align: align ?? 'left',
    _meta: _meta as TMeta ?? {} as TMeta,
    ...rest,
    isVisible(): boolean {
      return isColumnVisible(this)
    },
    isSortable(): boolean {
      return isColumnSortable(this)
    },
    isFilterable(): boolean {
      return isColumnFilterable(this)
    }
  };
}
