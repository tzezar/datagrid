import { DEFAULT_COLUMN_SIZE } from "../defaults";
import type { CreateGroupColumnProps, GroupColumn } from "./types";


export function createColumnGroup<TOriginalRow>(
  { header, columns, columnId, _meta, ...rest }: CreateGroupColumnProps<TOriginalRow>
): GroupColumn<TOriginalRow> {
  return {
    type: 'group',
    columnId,
    parentColumnId: rest.parentColumnId || null,
    header,
    _meta: _meta ?? {},
    columns,
    options: {
      searchable: null,
      groupable: null,
      sortable: null,
      filterable: null,
      pinnable: null,
      moveable: true,
    },
    state: {
      size: DEFAULT_COLUMN_SIZE,
      visible: null,
      pinning: {
        position: 'none',
        offset: 0
      }
    },

    ...rest
  };
}
