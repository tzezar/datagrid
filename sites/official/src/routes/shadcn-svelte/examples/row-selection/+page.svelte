<script lang="ts">
	import '$lib/datagrid/prebuilt/shadcn/styles.css';
	import { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import { inventoryColumns } from './columns.svelte';
	import DatagridShadcnSvelte from '$lib/datagrid/prebuilt/shadcn/datagrid.svelte';

	let { data } = $props();

	let datagrid = new TzezarsDatagrid({
		columns: inventoryColumns,
		data: data.users,

		// todo fix this, tzezars datagrid is taking wrong config for datagrid core

		features: {
			rowSelection: {
				maxSelectedRows: 2,

				onRowSelectionChange: (selection) => {
					console.log(selection)
				}
			}
		},

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
				rowSelection: {
					maxSelectedRows: 2
				}
			}
		}
	});

	$effect(() => {
		console.log(datagrid.features.rowSelection.maxSelectedRows)
	})

</script>

<DatagridShadcnSvelte {datagrid} />
