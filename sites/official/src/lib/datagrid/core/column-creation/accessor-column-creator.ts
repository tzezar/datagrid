import { DEFAULT_COLUMN_SIZE } from "../defaults";
import { createColumnId, createHeader, getNestedValue } from "../utils.svelte";
import { isColumnFilterable, isColumnSortable, isColumnVisible } from "./column-methods";
import type { DotNestedKeys, CreateAccessorColumnProps, AccessorColumn } from "./types";

export function createAccessorColumn<
  TOriginalRow extends Record<string, any>,
  TKey extends DotNestedKeys<TOriginalRow>
>(
  { header, accessorKey, columnId, getValueFn: getValue, options, _meta = {}, state, ...rest }: CreateAccessorColumnProps<TOriginalRow, TKey>
): AccessorColumn<TOriginalRow> {

  if (!accessorKey) throw new Error(`accessorKey must be defined`);
  if (!header && !accessorKey && !columnId) throw new Error(`Either header, accessorKey or columnId must be defined`);

  const getValueFn: (row: TOriginalRow) => any =
    getValue ?? ((row: TOriginalRow) => getNestedValue(row, accessorKey));

  // Use createHeader to calculate header if not explicitly provided
  const computedHeader = createHeader({
    header,
    accessorKey,
    columnId,
  });

  const computedColumnId = createColumnId({ columnId, accessorKey, header });

  return {
    type: 'accessor',
    columnId: computedColumnId,
    parentColumnId: rest.parentColumnId || null,
    header: computedHeader,
    accessorKey,
    getValueFn,
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
