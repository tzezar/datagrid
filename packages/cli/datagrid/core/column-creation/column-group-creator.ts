import { DEFAULT_COLUMN_SIZE, DEFAULT_NOT_DEFINED_COLUMN_SIZE } from "../defaults";
import { isColumnFilterable, isColumnSortable, isColumnVisible } from "./column-methods";
import type { ColumnGroup } from "../types";
import type { CreateGroupColumnProps } from "./types";

/**
 * Generates a unique column ID for a group column based on the provided `columnId` or `header`.
 * If neither is provided, an error is thrown.
 * If only `header` is provided, the header is sanitized by converting to lowercase and replacing spaces with underscores.
 * 
 * @param {Object} params - The parameters to create the column ID.
 * @param {string} [params.columnId] - An optional explicit column ID.
 * @param {string} [params.header] - An optional header text to generate a column ID if no `columnId` is provided.
 * @throws {Error} Throws an error if neither `columnId` nor `header` is provided.
 * @returns {string} The unique column ID for the group column.
 */
const createGroupColumnColumnId = ({ columnId, header }: { columnId?: string, header?: string }): string => {
  if (columnId) return columnId;
  if (header) return header.toLowerCase().replace(/\s+/g, "_"); // Fallback to a sanitized header
  throw new Error("A valid columnId, header must be provided to create a group column.");
}

/**
 * Creates a new column group object, which represents a group of columns in a table.
 * This function constructs the column group by validating properties, generating the column ID, 
 * and setting default options and state. It includes helper methods like `isVisible`, `isSortable`, 
 * and `isFilterable` to check properties of the group.
 * 
 * @template TOriginalRow - The type representing the original row data structure.
 * @template TMeta - The type for metadata associated with the group column.
 * 
 * @param {CreateGroupColumnProps<TOriginalRow, TMeta>} props - The properties used to define the column group.
 * @param {string} [props.header] - The header text for the column group.
 * @param {Array} props.columns - The list of columns that are part of the group.
 * @param {string} [props.columnId] - An optional explicit column ID for the group.
 * @param {TMeta} [_meta] - Optional metadata for the group column.
 * @param {Object} [rest] - Any additional properties passed for further customization.
 * 
 * @returns {ColumnGroup<TOriginalRow>} The created column group object.
 */
export function createColumnGroup<TOriginalRow, TMeta>(
  { header, columns, columnId, _meta, ...rest }: CreateGroupColumnProps<TOriginalRow, TMeta>
): ColumnGroup<TOriginalRow> {
  // Generate the column ID for the group
  const computedColumnId = createGroupColumnColumnId({ header, columnId });

  // Return the constructed column group object
  return {
    type: 'group', // This is a group column type
    columnId: computedColumnId,
    parentColumnId: rest.parentColumnId || null, // Optional parent column ID for nested groups
    header, // The header text for the group
    _meta: _meta as TMeta ?? {} as TMeta, // Metadata for the group column
    columns, // The columns that belong to this group
    options: {
      searchable: null, // Group columns are not searchable by default
      groupable: null, // Group columns are not groupable by default
      sortable: null, // Group columns are not sortable by default
      filterable: null, // Group columns are not filterable by default
      pinnable: null, // Group columns are not pinnable by default
      moveable: true, // Group columns are movable by default
      resizable: false, // Group columns are not resizable by default
    },
    state: {
      size: DEFAULT_NOT_DEFINED_COLUMN_SIZE, // Default column size for the group
      visible: null, // Visibility state for the group
      pinning: {
        position: 'none', // Default pinning position is 'none'
        offset: 0, // Default offset for pinning
      },
    },
    ...rest, // Additional custom properties
    // Helper methods to check column properties
    isVisible(): boolean {
      return isColumnVisible(this); // Check if the column is visible
    },
    isSortable(): boolean {
      return isColumnSortable(this); // Check if the column is sortable
    },
    isFilterable(): boolean {
      return isColumnFilterable(this); // Check if the column is filterable
    },
  };
}
