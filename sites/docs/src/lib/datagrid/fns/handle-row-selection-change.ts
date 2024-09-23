// handle-row-selection-change.ts
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
        return [...data];
      case 'none':
        return [];
      case 'allOnPage': {
        // Add rows on page if not already selected
        const newSelections = visibleRows.filter(row => !selectedRows.includes(row));
        return [...selectedRows, ...newSelections];
      }
      case 'noneOnPage': {
        // Remove rows on page from selected rows
        return selectedRows.filter(row => !visibleRows.includes(row));
      }
      default:
        return selectedRows; // No change
    }
  };
  