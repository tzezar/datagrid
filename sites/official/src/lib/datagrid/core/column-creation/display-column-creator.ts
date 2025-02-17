import { DEFAULT_COLUMN_SIZE } from "../defaults";
import type { DisplayColumn } from "../types";
import { isColumnFilterable, isColumnSortable, isColumnVisible } from "./column-methods";
import type { CreateDisplayColumnProps } from "./types";

/**
 * Generates a unique column ID for a display column based on the provided `columnId` or `header`.
 * If neither is provided, an error is thrown.
 * If only `header` is provided, the header is sanitized by converting it to lowercase and replacing spaces with underscores.
 * 
 * @param {Object} params - The parameters to create the column ID.
 * @param {string} [params.columnId] - An optional explicit column ID.
 * @param {string} [params.header] - An optional header text to generate a column ID if no `columnId` is provided.
 * @throws {Error} Throws an error if neither `columnId` nor `header` is provided.
 * @returns {string} The unique column ID for the display column.
 */
const createDisplayColumnColumnId = ({ columnId, header }: { columnId?: string, header?: string }): string => {
  if (columnId) return columnId;
  if (header) return header.toLowerCase().replace(/\s+/g, "_"); // Fallback to a sanitized header
  throw new Error("A valid columnId, header must be provided to create a display column.");
}

/**
 * Creates a new display column object, which represents a column used for displaying data in a table.
 * This function constructs the display column by validating properties, generating the column ID,
 * and setting default options and state. It includes helper methods like `isVisible`, `isSortable`,
 * and `isFilterable` to check properties of the column.
 * 
 * @template TOriginalRow - The type representing the original row data structure.
 * @template TMeta - The type for metadata associated with the display column.
 * 
 * @param {CreateDisplayColumnProps<TOriginalRow, TMeta>} props - The properties used to define the display column.
 * @param {string} props.header - The header text for the display column.
 * @param {string} [props.columnId] - An optional explicit column ID for the display column.
 * @param {function} props.cell - The function used to render the column's cell content.
 * @param {TMeta} [_meta] - Optional metadata for the display column.
 * @param {string} [props.align] - The alignment of the column's content. Defaults to 'left' if not provided.
 * @param {Object} [props.options] - Optional configuration options for the display column.
 * @param {Object} [props.state] - Optional state for the display column, including visibility and size.
 * @param {Object} [rest] - Any additional properties passed for further customization.
 * 
 * @returns {DisplayColumn<TOriginalRow>} The created display column object.
 */
export function createDisplayColumn<TOriginalRow extends Record<string, any>, TMeta>(
  { header, cell, columnId, _meta, options, state, align, ...rest }: CreateDisplayColumnProps<TOriginalRow, TMeta>
): DisplayColumn<TOriginalRow> {
  // Generate the column ID for the display column
  const computedColumnId = createDisplayColumnColumnId({ header, columnId });

  // Return the constructed display column object
  return {
    type: 'display', // This is a display column type
    header, // The header text for the display column
    columnId: computedColumnId, // The unique column ID
    parentColumnId: rest.parentColumnId || null, // Optional parent column ID for nested columns
    cell, // The function for rendering the column's cell content
    options: {
      calculateFacets: null, // No facets calculation for this column
      searchable: null, // Column is not searchable by default
      groupable: null, // Column is not groupable by default
      sortable: null, // Column is not sortable by default
      filterable: null, // Column is not filterable by default
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
    _meta: _meta ?? {}, // Metadata for the display column
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
