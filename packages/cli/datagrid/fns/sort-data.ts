// import type { Sorting } from "../types";

// function createCompositeKey<T>(item: T, sorting: Sorting[]): string {
//     return sorting.map(({ columnId, direction }) => {
//         const value = item[columnId];
//         return `${direction === 'asc' ? '' : '-'}${value}`;
//     }).join('|');
// }

// export function sortData<T>(data: T[], sorting: Sorting[]): T[] {
//     console.log('sort')
//     return data.sort((a, b) => {
//         const keyA = createCompositeKey(a, sorting);
//         const keyB = createCompositeKey(b, sorting);
//         return keyA.localeCompare(keyB);
//     });
// }

// import type { Sorting } from "../types";


// // it looks like thise one is more performant then composite key solution
// export const sortData = <T>(data: T[], sorting: Sorting[]): T[] => {
//     console.log('sorted')
//     return data.sort((a, b) => {
//         for (const sort of sorting) {
//             const { columnId, direction } = sort;
//             const aValue = a[columnId];
//             const bValue = b[columnId];

//             let comparison = 0;
//             if (aValue < bValue) {
//                 comparison = -1;
//             } else if (aValue > bValue) {
//                 comparison = 1;
//             }

//             // Reverse the comparison for descending order
//             if (direction === 'desc') {
//                 comparison = comparison * -1;
//             }

//             // If comparison is not zero, return the result
//             if (comparison !== 0) {
//                 return comparison;
//             }
//         }
//         return 0; // If all sorting criteria are equal
//     });
// }


// export function sortData<T>(data: T[], sorting: Sorting[]): T[] {
//     return sort(data).by(sorting.map(({ columnId, direction }) => {
//         return direction === 'asc' ? (item: T) => item[columnId] : (item: T) => -item[columnId];
//     }));
// }




import { sort, createNewSortInstance } from 'fast-sort';
import type { Sorting } from '../types';
import { getNestedValue } from './get-nested-value';

const naturalSort = createNewSortInstance({
    comparer: new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare,
});

// * this one is the fastest!
// TODO: type it better
export function sortData<T>(data: T[], sorting: Sorting[]): T[] {
    if (sorting.length === 0) {
        return data;
    } else if (sorting.length === 1) {
        const { columnId, direction } = sorting[0];
        if (direction === 'asc') {
            return sort(data).asc(item => getNestedValue(item, columnId));
        } else {
            return sort(data).desc(item => getNestedValue(item, columnId));
        }
    } else {
        const sortingArray: { [key: string]: (item: T) => unknown }[] = [];
        for (const sortItem of sorting) {
            const { columnId, direction } = sortItem;
            sortingArray.push({
                [direction]: (item: T) => getNestedValue(item, columnId)
            });
        }
        // TODO: type it properly
        // @ts-ignore
        return sort(data).by(sortingArray);
    }
}
