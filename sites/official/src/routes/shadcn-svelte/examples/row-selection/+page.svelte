<script lang="ts">
	import '$lib/datagrid/prebuilt/shadcn/styles.css';
	import { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import { inventoryColumns } from './columns.svelte';
	import DatagridShadcnSvelte from '$lib/datagrid/prebuilt/shadcn/datagrid.svelte';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	let datagrid = new TzezarsDatagrid({
		columns: inventoryColumns,
		data: data.users,

		features: {
			rowSelection: {
				maxSelectedRows: 2,
			}
		},

		extra: {
			features: {
				clickToCopy: {
					onClickToCopy(value) {
						toast.info(`Copied ${value} to clipboard`);
					},
				},
				animations: {
					animateRows: true,
					animateHeaders: true
				},
				rowSelection: {
					onSelectMoreThanMaxSelectedRows() {
						toast.error('You reached the maximum number of selected rows');
					},
					onRowSelectionChange() {
						// toast.info('Row selected ');
					}
				},
				sorting: {
					enableMultiSort: true,
					enableSorting: true,
					manualSorting: false,
					maxMultiSortColCount: 2,
					isMultiSortEvent: () => true
				}
			}
		}
	});

	$effect(() => {
		console.log($state.snapshot(datagrid.features.filtering.conditions))	
	})


</script>

<DatagridShadcnSvelte {datagrid}></DatagridShadcnSvelte>
