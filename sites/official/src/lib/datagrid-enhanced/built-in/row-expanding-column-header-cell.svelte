<script lang="ts" generics="T">
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import type { EnhancedDatagrid } from '../core/index.svelte';
	import LeafColumnCell from '../structure/leaf-column-cell.svelte';

	let { datagrid, column }: { datagrid: EnhancedDatagrid<any>; column: LeafColumn<any> } = $props();



</script>

<LeafColumnCell {datagrid} {column} class="flex h-full items-center justify-center px-2 border-r ">
    <div>

    </div>
</LeafColumnCell>
