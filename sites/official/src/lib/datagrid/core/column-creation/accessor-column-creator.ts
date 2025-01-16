import { DEFAULT_COLUMN_SIZE } from "../defaults";
import type { AccessorColumn } from "../types";
import { isColumnFilterable, isColumnSortable, isColumnVisible } from "./column-methods";
import type { DotNestedKeys, CreateAccessorColumnProps } from "./types";


function getNestedValue<T>(obj: T, path: string): any {
  return path.split('.').reduce((acc: any, key: string) => acc?.[key], obj);
}


function createAccessorColumnHeader({ header, accessorKey, columnId }: { header?: string, accessorKey?: string, columnId?: string }): string {
  if (header) {
    // If a header is explicitly defined, return it
    return header;
  } else if (columnId) {
    // If no header is defined, use the accessorKey (formatted for better readability)
    return columnId;
  } else if (accessorKey) {
    // If no header is defined, use the accessorKey (formatted for better readability)
    return formatAccessorKey(accessorKey);
  }
  throw new Error(`Either header or accessorKey or columnId must be defined`);
  // Fallback to the columnId if neither header nor accessorKey are available
}

/**
* Formats an accessor key into a more human-readable string.
* For example, "profile.email" becomes "Profile Email".
*/
function formatAccessorKey(accessorKey: string): string {
  return accessorKey
    .split('.') // Split nested keys by `.`
    .map(key => key.charAt(0).toUpperCase() + key.slice(1)) // Capitalize each part
    .join(' '); // Join with a space
}

/**
* Generates a column ID if not explicitly provided.
* Fallback logic: Use `accessorKey`, then `header`, or throw an error if neither is available.
*/
function createAccessorColumnColumnId({
  columnId,
  accessorKey,
  header,
}: {
  columnId?: string;
  accessorKey?: string;
  header?: string;
}): string {
  if (columnId) return columnId;
  if (accessorKey) return accessorKey; // Use accessorKey as the fallback column ID
  if (header) return header.toLowerCase().replace(/\s+/g, "_"); // Fallback to a sanitized header
  throw new Error("A valid columnId, accessorKey, or header must be provided to create a column.");
}



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
  const computedHeader = createAccessorColumnHeader({
    header,
    accessorKey,
    columnId,
  });

  const computedColumnId = createAccessorColumnColumnId({ columnId, accessorKey, header });

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
    },

  };
}
