import { goto } from '$app/navigation';
import type { DatagridCore } from '$lib/datagrid';
import type { Sorting } from '$lib/datagrid/core/types';

export const handleServerSideSorting = async (datagrid: DatagridCore) => {
	const sortings = datagrid.features.sorting.sortConfigs;
	type Sorting = { columnId: string; direction: string | null };
	type ValidSorting = { columnId: string; direction: 'asc' | 'desc' };

	function isValidSorting(sort: Sorting | undefined | null): sort is ValidSorting {
		return !!sort && (sort.direction === 'asc' || sort.direction === 'desc');
	}

	const mappedSortings: ValidSorting[] = sortings
		.map((sort): Sorting | undefined => {
			let columnId = sort.columnId;
			let direction: string | null;

			if (sort.direction === 'ascending') {
				direction = 'asc';
			} else if (sort.direction === 'descending') {
				direction = 'desc';
			} else {
				return undefined;
			}

			return {
				columnId,
				direction
			};
		})
		.filter(isValidSorting);

	const url = new URL(window.location.href);

	const mappedSorting = mappedSortings[0];
	if (!mappedSorting) {
		url.searchParams.delete('sortBy');
		url.searchParams.delete('sortOrder');
	} else {
		url.searchParams.set('sortBy', mappedSorting.columnId);
		url.searchParams.set('sortOrder', mappedSorting.direction);
	}

	// Update URL to trigger server-side load with new sorting parameters
	await goto(url.pathname + '?' + url.searchParams.toString(), { replaceState: true });
};

export function getSortingFromUrl(sortBy: string | null, sortOrder: string | null) {
	const initialSortConfigs: Sorting[] = [];
	if (sortBy && sortOrder) {
		initialSortConfigs.push({
			columnId: sortBy,
			direction: sortOrder === 'asc' ? 'ascending' : 'descending'
		});
	}
	return initialSortConfigs;
}
