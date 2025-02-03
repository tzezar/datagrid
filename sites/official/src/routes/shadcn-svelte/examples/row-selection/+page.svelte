<script lang="ts">
	import { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import { inventoryColumns } from './columns.svelte';
	import DatagridShadcnSvelte from '$lib/datagrid/prebuilt/shadcn/datagrid.svelte';
	import { toast } from 'svelte-sonner';
	import type { InventoryItem } from '$lib/data-generators/generate/inventory';
	import type { EnhancedColumnMeta } from '$lib/datagrid/prebuilt/shadcn/core/types';

	let { data } = $props();

	let datagrid = new TzezarsDatagrid<InventoryItem, EnhancedColumnMeta<InventoryItem>>({
		columns: inventoryColumns,
		data: data.users,

		features: {
			rowSelection: {
				onRowSelectionChange() {
					console.log('Row selected ');
				}
			}
		},


		extra: {
			features: {
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

	const col = datagrid.columns[0]
	if (col.type === 'accessor' && col._meta.tooltip){}

</script>

<DatagridShadcnSvelte {datagrid}></DatagridShadcnSvelte>
