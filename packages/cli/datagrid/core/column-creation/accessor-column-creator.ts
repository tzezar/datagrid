import { DEFAULT_COLUMN_SIZE, DEFAULT_NOT_DEFINED_COLUMN_SIZE } from "../defaults";
import type { AccessorColumn } from "../types";
import { isColumnFilterable, isColumnSortable, isColumnVisible } from "./column-methods";
import type { DotNestedKeys, CreateAccessorColumnProps } from "./types";

/**
 * Retrieves a nested value from an object using dot notation path.
 * 
 * @param {T} obj The object to retrieve the value from.
 * @param {string} path The dot notation path specifying the nested value.
 * @returns {any} The value found at the given path in the object.
 * 
 * @example
 * getNestedValue({ user: { profile: { name: 'John' } } }, 'user.profile.name'); // 'John'
 */
function getNestedValue<T>(obj: T, path: string): any {
  return path.split('.').reduce((acc: any, key: string) => acc?.[key], obj);
}

/**
 * Formats an accessor key into a more human-readable string by splitting it into words
 * and capitalizing the first letter of each word.
 * 
 * @param {string} accessorKey The accessor key to format.
 * @returns {string} The formatted accessor key.
 * 
 * @example
 * formatAccessorKey("profile.email"); // "Profile Email"
 */
function formatAccessorKey(accessorKey: string): string {
  return accessorKey
    .split('.')
    .map(key => key.charAt(0).toUpperCase() + key.slice(1))
    .join(' ');
}

/**
 * Determines the column header based on the provided options, with fallback hierarchy:
 * 1. Explicit header
 * 2. Column ID
 * 3. Formatted accessor key
 * 
 * @param {object} options The options for determining the column header.
 * @param {string} [options.header] The explicit header.
 * @param {string} [options.accessorKey] The accessor key.
 * @param {string} [options.columnId] The column ID.
 * @returns {string} The determined column header.
 * @throws {Error} Throws an error if neither header, accessorKey, nor columnId are provided.
 * 
 * @example
 * createColumnHeader({ header: "Name" }); // "Name"
 * createColumnHeader({ accessorKey: "profile.email" }); // "Profile Email"
 */
function createColumnHeader({ 
  header, 
  accessorKey, 
  columnId 
}: { 
  header?: string; 
  accessorKey?: string; 
  columnId?: string;
}): string {
  if (header) {
    return header;
  } else if (columnId) {
    return columnId;
  } else if (accessorKey) {
    return formatAccessorKey(accessorKey);
  }
  throw new Error("Either header, accessorKey, or columnId must be defined");
}

/**
 * Generates a unique column ID with fallback logic:
 * 1. Explicit columnId
 * 2. Accessor key
 * 3. Sanitized header (lowercased and spaces replaced with underscores)
 * 
 * @param {object} options The options for generating the column ID.
 * @param {string} [options.columnId] The explicit column ID.
 * @param {string} [options.accessorKey] The accessor key.
 * @param {string} [options.header] The column header.
 * @returns {string} The generated column ID.
 * @throws {Error} Throws an error if none of columnId, accessorKey, or header are provided.
 * 
 * @example
 * createColumnId({ columnId: "email" }); // "email"
 * createColumnId({ header: "User Email" }); // "user_email"
 */
function createColumnId({
  columnId,
  accessorKey,
  header,
}: {
  columnId?: string;
  accessorKey?: string;
  header?: string;
}): string {
  if (columnId) return columnId;
  if (accessorKey) return accessorKey;
  if (header) return header.toLowerCase().replace(/\s+/g, "_");
  throw new Error("A valid columnId, accessorKey, or header must be provided");
}

/**
 * Creates an accessor column configuration with proper type handling and validation.
 * This function is responsible for setting up the necessary properties of an accessor column, 
 * including validation of required fields, and calculating derived properties such as 
 * `header`, `columnId`, and `getValueFn`.
 * 
 * @template TOriginalRow The type of the original row data.
 * @template TKey The type of the key used to access data in the row.
 * @template TMeta The type of additional metadata for the column.
 * 
 * @param {CreateAccessorColumnProps<TOriginalRow, TKey, TMeta>} props The properties for creating the accessor column.
 * @returns {AccessorColumn<TOriginalRow, TMeta>} The created accessor column configuration.
 * @throws {Error} Throws an error if `accessorKey` is not provided.
 * 
 * @example
 * const column = createAccessorColumn({
 *   accessorKey: "profile.email",
 *   header: "Email Address",
 *   options: { searchable: true },
 *   state: { size: 200 }
 * });
 * // Returns an accessor column object with the defined properties
 */
export function createAccessorColumn<
  TOriginalRow extends Record<string, any>,
  TKey extends DotNestedKeys<TOriginalRow>,
  TMeta,
>(props: CreateAccessorColumnProps<TOriginalRow, TKey, TMeta>): AccessorColumn<TOriginalRow, TMeta> {
  const {
    header,
    accessorKey,
    columnId,
    getValueFn: customGetValue,
    align,
    options,
    _meta,
    state,
    ...rest
  } = props;

  // Validate required properties
  if (!accessorKey) {
    throw new Error("accessorKey must be defined");
  }

  // Define the value accessor function
  const getValueFn = customGetValue || ((row: TOriginalRow) => getNestedValue(row, accessorKey));

  // Calculate derived properties
  const computedHeader = createColumnHeader({ header, accessorKey, columnId });
  const computedColumnId = createColumnId({ columnId, accessorKey, header });

  // Create the column configuration
  return {
    type: 'accessor',
    columnId: computedColumnId,
    parentColumnId: rest.parentColumnId || null,
    header: computedHeader,
    accessorKey,
    getValueFn,
    options: {
      calculateFacets: options?.calculateFacets ?? false,
      searchable: options?.searchable ?? true,
      groupable: options?.groupable ?? true,
      sortable: options?.sortable ?? true,
      filterable: options?.filterable ?? true,
      pinnable: options?.pinnable ?? true,
      moveable: options?.moveable ?? true,
      hideable: options?.hideable ?? true,
      resizable: options?.resizable ?? true
    },
    state: {
      size: state?.size ?? DEFAULT_NOT_DEFINED_COLUMN_SIZE,
      visible: state?.visible ?? true,
      pinning: {
        position: state?.pinning?.position ?? 'none',
        offset: 0
      },
    },
    align: align ?? 'left',
    _meta: _meta as TMeta ?? {} as TMeta,
    ...rest,
    
    // Column methods
    isVisible: function() { return isColumnVisible(this); },
    isSortable: function() { return isColumnSortable(this); },
    isFilterable: function() { return isColumnFilterable(this); }
  };
}
