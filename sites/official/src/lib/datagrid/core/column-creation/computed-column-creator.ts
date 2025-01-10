import { DEFAULT_COLUMN_SIZE } from "../defaults";
import type { CreateComputeColumnProps, ComputedColumn } from "./types";


export function createComputedColumn<TOriginalRow extends Record<string, any>>(
  { header, columnId, getValueFn: getValue, _meta = {}, options, state, ...rest }: CreateComputeColumnProps<TOriginalRow>
): ComputedColumn<TOriginalRow> {
  return {
    type: 'computed',
    header,
    columnId,
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
      size: DEFAULT_COLUMN_SIZE,
      visible: state?.visible ?? true,
      pinning: {
        position: state?.pinning?.position ?? 'none',
        offset: 0
      },
    },
    _meta: _meta ?? {},
    ...rest
  };
}
