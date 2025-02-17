import { DEFAULT_COLUMN_SIZE } from "../defaults";
import type { ComputedColumn } from "../types";
import { isColumnFilterable, isColumnSortable, isColumnVisible } from "./column-methods";
import type { CreateComputeColumnProps } from "./types";

/**
 * Generates a unique column ID for a computed column based on the provided `columnId` or `header`.
 * If neither is provided, an error is thrown.
 * If only `header` is provided, the header is sanitized by converting it to lowercase and replacing spaces with underscores.
 * 
 * @param {Object} params - The parameters to create the column ID.
 * @param {string} [params.columnId] - An optional explicit column ID.
 * @param {string} [params.header] - An optional header text to generate a column ID if no `columnId` is provided.
 * @throws {Error} Throws an error if neither `columnId` nor `header` is provided.
 * @returns {string} The unique column ID for the computed column.
 */
const createComputedColumnColumnId = ({ columnId, header }: { columnId?: string, header?: string }): string => {
  if (columnId) return columnId;
  if (header) return header.toLowerCase().replace(/\s+/g, "_"); // Fallback to a sanitized header
  throw new Error("A valid columnId, header must be provided to create a computed column.");
}

/**
 * Creates a new computed column object, which represents a column that dynamically computes its value.
 * This function constructs the computed column by validating properties, generating the column ID,
 * and setting default options and state. It includes helper methods like `isVisible`, `isSortable`,
 * and `isFilterable` to check properties of the column.
 * 
 * @template TOriginalRow - The type representing the original row data structure.
 * @template TMeta - The type for metadata associated with the computed column.
 * 
 * @param {CreateComputeColumnProps<TOriginalRow, TMeta>} props - The properties used to define the computed column.
 * @param {string} props.header - The header text for the computed column.
 * @param {string} [props.columnId] - An optional explicit column ID for the computed column.
 * @param {function} props.getValue - A function used to compute the value of the column for each row.
 * @param {TMeta} [_meta] - Optional metadata for the computed column.
 * @param {string} [props.align] - The alignment of the column's content. Defaults to 'left' if not provided.
 * @param {Object} [props.options] - Optional configuration options for the computed column.
 * @param {Object} [props.state] - Optional state for the computed column, including visibility and size.
 * @param {Object} [rest] - Any additional properties passed for further customization.
 * 
 * @returns {ComputedColumn<TOriginalRow>} The created computed column object.
 */
export function createComputedColumn<TOriginalRow extends Record<string, any>, TMeta>(
  { header, columnId, getValueFn, _meta , align, options, state, ...rest }: CreateComputeColumnProps<TOriginalRow, TMeta>
): ComputedColumn<TOriginalRow> {
  // Generate the column ID for the computed column
  const computedColumnId = createComputedColumnColumnId({ header, columnId });

  // Return the constructed computed column object
  return {
    type: 'computed', // This is a computed column type
    header, // The header text for the computed column
    columnId: computedColumnId, // The unique column ID
    parentColumnId: rest.parentColumnId || null, // Optional parent column ID for nested columns
    getValueFn, // The function used to compute the column value
    options: {
      calculateFacets: options?.calculateFacets ?? false, // Whether to calculate facets for this column
      searchable: options?.searchable ?? true, // Whether the column is searchable
      groupable: options?.groupable ?? true, // Whether the column can be grouped
      sortable: options?.sortable ?? true, // Whether the column is sortable
      filterable: options?.filterable ?? true, // Whether the column is filterable
      pinnable: options?.pinnable ?? true, // Whether the column is pinnable
      moveable: options?.moveable ?? true, // Whether the column is movable
      hideable: options?.hideable ?? true, // Whether the column is hideable
      resizable: options?.resizable ?? true, // Whether the column is resizable
    },
    state: {
      size: state?.size ?? DEFAULT_COLUMN_SIZE, // Default column size
      visible: state?.visible ?? true, // Default visibility state for the column
      pinning: {
        position: state?.pinning?.position ?? 'none', // Default pinning position
        offset: 0, // Default pinning offset
      },
    },
    align: align ?? 'left', // Default alignment is 'left'
    _meta: _meta as TMeta ?? {} as TMeta, // Metadata for the computed column
    ...rest, // Any additional custom properties
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
