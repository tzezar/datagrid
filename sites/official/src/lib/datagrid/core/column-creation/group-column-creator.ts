import { DEFAULT_COLUMN_SIZE } from "../defaults";
import { isColumnFilterable, isColumnSortable, isColumnVisible } from "./column-methods";
import type { GroupColumn } from "../types";
import type { CreateGroupColumnProps } from "./types";

const createGroupColumnColumnId = ({ columnId, header }: { columnId?: string, header?: string }): string => {
  if (columnId) return columnId;
  if (header) return header.toLowerCase().replace(/\s+/g, "_"); // Fallback to a sanitized header
  throw new Error("A valid columnId, header must be provided to create a group column.");
}

export function createColumnGroup<TOriginalRow, TMeta>(
  { header, columns, columnId, _meta, ...rest }: CreateGroupColumnProps<TOriginalRow, TMeta>
): GroupColumn<TOriginalRow, TMeta> {



  const computedColumnId = createGroupColumnColumnId({ header, columnId });

  return {
    type: 'group',
    columnId: computedColumnId,
    parentColumnId: rest.parentColumnId || null,
    header,
    _meta: _meta  as TMeta?? {} as TMeta,
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
