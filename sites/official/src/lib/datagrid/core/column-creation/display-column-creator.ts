import { DEFAULT_COLUMN_SIZE } from "../defaults";
import { isColumnFilterable, isColumnSortable, isColumnVisible } from "./column-methods";
import type { CreateDisplayColumnProps, DisplayColumn } from "./types";


export function createDisplayColumn<TOriginalRow extends Record<string, any>>(
  { header, cell, columnId, _meta, options, state, ...rest }: CreateDisplayColumnProps<TOriginalRow>
): DisplayColumn<TOriginalRow> {
  return {
    type: 'display',
    header,
    columnId,
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
    _meta: _meta ?? {},
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
