<script lang="ts">
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import type { GridRow } from '$lib/datagrid/core/types';
	import FreezeRow from '$lib/datagrid/icons/tabler/freeze-row.svelte';

	let { row, datagrid }: { row: GridRow<any>; datagrid: Datagrid<any> } = $props();
</script>

<div class="flex flex-row gap-2 h-full">
	<button onclick={() => datagrid.rowPinning.pinRowTop(row.identifier)}><FreezeRow /></button>
	<button onclick={() => datagrid.rowPinning.pinRowBottom(row.identifier)}>
		<FreezeRow class="rotate-180" />
	</button>
</div>
