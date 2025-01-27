<script lang="ts">
	import '$lib/datagrid/prebuilt/shadcn/styles.css';
	import { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import { inventoryColumns } from './columns.svelte';
	import DatagridShadcnSvelte from '$lib/datagrid/prebuilt/shadcn/datagrid.svelte';

	let { data } = $props();

	let datagrid = new TzezarsDatagrid({
		columns: inventoryColumns,
		data: data.users,
		extra: {
			features: {
				animations: {
					animateRows: true,
					animateHeaders: true
				},
				sorting: {
					enableMultiSort: true,
					enableSorting: true,
					manualSorting: false,
					maxMultiSortColCount: 2,
					isMultiSortEvent: () => true
				},
			}
		}
	});

	


</script>

<DatagridShadcnSvelte {datagrid} />

