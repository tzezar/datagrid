<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import type { CustomCellProps } from '$lib/datagrid/core/types';

	let { column, datagrid, row }: CustomCellProps<any> = $props();
</script>

<div class="flex items-center w-full justify-around">
	<button onclick={()=>datagrid.handlers.rowPinning.pinRowTop(row.identifier)}> Pin Top </button>
	<button onclick={()=>datagrid.handlers.rowPinning.pinRowBottom(row.identifier)}> Pin Bottom </button>
</div>
