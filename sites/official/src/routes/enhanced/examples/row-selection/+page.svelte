<script lang="ts">
	import { toast } from 'svelte-sonner';
	import type { InventoryItem } from '$lib/data-generators/generate/inventory';
	import { Datagrid, DatagridEnhanced, type EnhancedColumnMeta } from '$lib/datagrid-enhanced';
	import { inventoryColumns } from './columns.svelte';

	let { data } = $props();

	let datagrid = new DatagridEnhanced<InventoryItem, EnhancedColumnMeta<InventoryItem>>({
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

<Datagrid {datagrid}></Datagrid>
