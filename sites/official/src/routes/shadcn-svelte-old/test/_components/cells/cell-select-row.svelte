<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import type {
		CustomCellProps,
	} from '$lib/datagrid/core/types';

	let { column, datagrid, row }: CustomCellProps<any> = $props();

</script>

<div class="flex items-center">
	<Checkbox
		checked={datagrid.features.rowSelection.isRowSelected(row.identifier)}
		onCheckedChange={() => datagrid.features.rowSelection.toggleRowSelection(row.identifier)}
	/>
</div>
