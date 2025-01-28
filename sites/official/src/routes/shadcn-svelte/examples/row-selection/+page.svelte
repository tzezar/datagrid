<script lang="ts">
	import '$lib/datagrid/prebuilt/shadcn/styles.css';
	import { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import { inventoryColumns } from './columns.svelte';
	import DatagridShadcnSvelte from '$lib/datagrid/prebuilt/shadcn/datagrid.svelte';
	import { toast } from 'svelte-sonner';
	import { cn } from '$lib/utils';
	import { shouldHighlightSelectedRow } from '$lib/datagrid/prebuilt/shadcn/utils';

	let { data } = $props();

	let datagrid = new TzezarsDatagrid({
		columns: inventoryColumns,
		data: data.users,

		features: {
			rowSelection: {
				maxSelectedRows: 2
			}
		},

		extra: {
			features: {
				customization: {
					// getHeadClasses(): string {
					// 	return cn(
					// 		'grid-head',
					// 		this.customization?.theme === 'shadcn' && 'grid-head-shadcn',
					// 		this.customization?.stickyHeader && 'grid-head-sticky'
					// 	);
					// },
					// getBodyRowClasses(row, rowIndex): string {
					// 	return cn(
					// 		'grid-body-row',
					// 		row.original.id === 3 && '!bg-green-400',
					// 		this?.datagrid?.extra?.features?.stripedRows?.applyStripedRows(row, rowIndex)
					// 	);
					// },
					// getBodyRowCellClasses(datagrid, row, column) {
					// 	return cn(
					// 		'grid-body-row-cell',
					// 		shouldHighlightSelectedRow(datagrid, row) && 'bg-grid-accent/10',
					// 		column._meta.styles?.bodyCell({ datagrid, column, row })
					// 	);
					// }
				},

				clickToCopy: {
					onClickToCopy(value) {
						toast.info(`Copied ${value} to clipboard`);
					}
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
		console.log($state.snapshot(datagrid.features.filtering.conditions));
	});
</script>

<DatagridShadcnSvelte {datagrid}></DatagridShadcnSvelte>
