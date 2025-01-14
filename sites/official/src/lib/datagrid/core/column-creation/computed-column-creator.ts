import { DEFAULT_COLUMN_SIZE } from "../defaults";
import { isColumnFilterable, isColumnSortable, isColumnVisible } from "./column-methods";
import type { CreateComputeColumnProps, ComputedColumn } from "./types";


const createComputedColumnColumnId = ({ columnId, header }: { columnId?: string, header?: string }): string => {
  if (columnId) return columnId;
  if (header) return header.toLowerCase().replace(/\s+/g, "_"); // Fallback to a sanitized header
  throw new Error("A valid columnId, header must be provided to create a group column.");
}


export function createComputedColumn<TOriginalRow extends Record<string, any>>(
  { header, columnId, getValueFn: getValue, _meta = {}, options, state, ...rest }: CreateComputeColumnProps<TOriginalRow>
): ComputedColumn<TOriginalRow> {
  const computedColumnId = createComputedColumnColumnId({ header, columnId });
  return {
    type: 'computed',
    header,
    columnId: computedColumnId,
    parentColumnId: rest.parentColumnId || null,
    // accessorFn,
    getValueFn: getValue,
    options: {
      searchable: options?.searchable ?? true,
      groupable: options?.groupable ?? true,
      sortable: options?.sortable ?? true,
      filterable: options?.filterable ?? true,
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
      },
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
