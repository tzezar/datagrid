import { DEFAULT_COLUMN_SIZE } from "../defaults";
import { isColumnFilterable, isColumnSortable, isColumnVisible } from "./column-methods";
import type { CreateGroupColumnProps, GroupColumn } from "./types";

const createGroupColumnColumnId = ({ columnId, header }: { columnId?: string, header?: string }): string => {
  if (columnId) return columnId;
  if (header) return header.toLowerCase().replace(/\s+/g, "_"); // Fallback to a sanitized header
  throw new Error("A valid columnId, header must be provided to create a group column.");
}

export function createColumnGroup<TOriginalRow>(
  { header, columns, columnId, _meta, ...rest }: CreateGroupColumnProps<TOriginalRow>
): GroupColumn<TOriginalRow> {



  const computedColumnId = createGroupColumnColumnId({ header, columnId });
 
  return {
    type: 'group',
    columnId: computedColumnId,
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
      size:  DEFAULT_COLUMN_SIZE,
      visible: null,
      pinning: {
        position: 'none',
        offset: 0
      }
    },
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
