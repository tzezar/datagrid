/**
 * Handles the change in row selection based on the user's input.
 *
 * @param e - The event triggered by the selection change.
 * @param data - The complete dataset from which rows can be selected.
 * @param selectedRows - The currently selected rows.
 * @param visibleRows - The rows that are currently visible on the page.
 * @returns An updated array of selected rows.
 */
export const handleSelectionChange = <T>(
  e: Event,
  data: T[],
  selectedRows: T[],
  visibleRows: T[]
): T[] => {
  const selectElement = e.currentTarget as HTMLSelectElement;
  const value = selectElement.value;

  switch (value) {
      case 'all':
          return [...data]; // Select all rows

      case 'none':
          return []; // Deselect all rows

      case 'allOnPage': {
          // Select all visible rows that are not already selected
          const newSelections = visibleRows.filter(row => !selectedRows.includes(row));
          return [...selectedRows, ...newSelections];
      }

      case 'noneOnPage': {
          // Deselect all visible rows
          return selectedRows.filter(row => !visibleRows.includes(row));
      }

      default:
          return selectedRows; // Return current selections if no valid action
  }
};
