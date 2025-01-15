<script lang="ts">
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';
	import type { GridRow } from '$lib/datagrid/core/types';
	import FreezeRow from '$lib/datagrid/icons/tabler/freeze-row.svelte';

	let { row, datagrid }: { row: GridRow<any>; datagrid: DataGrid<any> } = $props();
</script>

<div class="flex flex-row gap-2 h-full">
	<button onclick={() => datagrid.features.rowPinning.pinRowTop(row.identifier)}><FreezeRow /></button>
	<button onclick={() => datagrid.features.rowPinning.pinRowBottom(row.identifier)}>
		<FreezeRow class="rotate-180" />
	</button>
</div>
