import { DEFAULT_COLUMN_SIZE } from "../defaults";
import { isColumnFilterable, isColumnSortable, isColumnVisible } from "./column-methods";
import type { DotNestedKeys, CreateAccessorColumnProps, AccessorColumn } from "./types";

export function createAccessorColumn<
  TOriginalRow extends Record<string, any>,
  TKey extends DotNestedKeys<TOriginalRow>
>(
  { header, accessorKey, columnId, getValueFn: getValue, options, _meta = {}, state, ...rest }: CreateAccessorColumnProps<TOriginalRow, TKey>
): AccessorColumn<TOriginalRow> {
  return {
    type: 'accessor',
    columnId,
    parentColumnId: rest.parentColumnId || null,
    header,
    accessorKey,
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
      size: DEFAULT_COLUMN_SIZE,
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
    },

  };
}
