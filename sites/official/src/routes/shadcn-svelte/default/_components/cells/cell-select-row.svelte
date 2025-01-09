<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import type { GridBasicRow } from '$lib/datagrid/core/types';

	let { row, datagrid }: { row: GridBasicRow<any>; datagrid: Datagrid<any> } = $props();
</script>

<div class="flex items-center">
	<Checkbox
		checked={datagrid.rowSelection.isRowSelected(row.identifier)}
		onCheckedChange={() => datagrid.rowSelection.toggleRowSelection(row.identifier)}
	/>
</div>
