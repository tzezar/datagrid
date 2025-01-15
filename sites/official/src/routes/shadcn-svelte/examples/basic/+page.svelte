<script lang="ts">
	import '$lib/datagrid/prebuilt/shadcn/styles.css';
	import { cn } from '$lib/utils';
	import { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import type { LeafColumn, GroupColumn } from '$lib/datagrid/core/types';

	import { Portal } from 'bits-ui';
	import { userColumns } from './columns.svelte';
	import { getCellContent, isCellComponent } from '$lib/datagrid/core/utils.svelte';
	import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';

	// Icones
	import ArrowRight from '$lib/datagrid/icons/material-symbols/arrow-right.svelte';

	// Blocks
	import HeaderCellDropdown from '$lib/datagrid/prebuilt/shadcn/blocks/header-cell-dropdown.svelte';
	import HeaderCellColumnFilter from '$lib/datagrid/prebuilt/shadcn/blocks/header-cell-column-filter.svelte';
	import ColumnSortingIndicator from '$lib/datagrid/prebuilt/shadcn/blocks/column-sorting-indicator.svelte';
	import Toolbar from '$lib/datagrid/prebuilt/shadcn/blocks/toolbar.svelte';
	import Pagination from '$lib/datagrid/prebuilt/shadcn/blocks/pagination.svelte';
	import MadeWithLoveByTzezar from '$lib/blocks/made-with-love-by-tzezar.svelte';
	import DatagridShadcnSvelte from '$lib/datagrid/prebuilt/shadcn/datagrid-shadcn-svelte.svelte';

	let { data } = $props();

	let datagrid = new TzezarsDatagrid({
		columns: userColumns,
		data: data.users
	});

	let columns = $derived(
		datagrid.extra.features.groupHeadersVisibility.showGroupHeaders
			? datagrid.columnManager.getColumnsInOrder()
			: datagrid.columnManager.getLeafColumnsInOrder()
	);

	// Crazy boost in performance
	const leafColumns = $derived(datagrid.columnManager.getLeafColumnsInOrder());
</script>


<DatagridShadcnSvelte {datagrid} />

