import { DEFAULT_COLUMN_SIZE } from "../defaults";
import type { CreateGroupColumnProps, GroupColumn } from "./types";


export function createColumnGroup<TOriginalRow extends Record<string, any>>(
  { header, columns, columnId, _meta, ...rest }: CreateGroupColumnProps<TOriginalRow>
): GroupColumn<TOriginalRow> {
  return {
    type: 'group',
    columnId,
    parentColumnId: rest.parentColumnId || null,
    header,
    _meta,
    columns,
    options: {
      searchable: null,
      groupable: null,
      sortable: null,
      filterable: null,
      pinnable: null,
      moveable: true,
      showDropdownOptions: null
    },
    state: {
      size: DEFAULT_COLUMN_SIZE,
      visible: null,
      pinning: {
        position: null,
        offset: 0
      }
    },
    ...rest
  };
}
