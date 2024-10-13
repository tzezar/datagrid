import { sort, createNewSortInstance } from 'fast-sort';
import type { Sorting } from '../types';
import { getNestedValue } from './get-nested-value';

// Create a natural sorting instance using Intl.Collator for better string comparison
const naturalSort = createNewSortInstance({
    comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
});

// Function to sort data based on specified sorting criteria
export function sortData<T>(data: T[], sorting: Sorting[]): T[] {
    // If no sorting criteria are provided, return the original data
    if (sorting.length === 0) {
        return data;
    }

    // If only one sorting criterion is specified, sort accordingly
    if (sorting.length === 1) {
        const { columnId, direction } = sorting[0];
        // Use ascending or descending sorting based on the direction
        return direction === 'asc' 
            ? sort(data).asc(item => getNestedValue(item, columnId))
            : sort(data).desc(item => getNestedValue(item, columnId));
    } 
    
    // Prepare an array for multiple sorting criteria
    const sortingArray: Array<{ [key: string]: (item: T) => unknown }> = [];

    // Build sorting criteria based on the provided sorting input
    for (const sortItem of sorting) {
        const { columnId, direction } = sortItem;

        // Push each sort criteria into the sortingArray
        sortingArray.push({
            [direction]: (item: T) => getNestedValue(item, columnId)
        });
    }

    // Sort the data using the compiled sorting criteria
    // Here we cast the sortingArray to 'any' to satisfy TypeScript
    return sort(data).by(sortingArray as any);
}
