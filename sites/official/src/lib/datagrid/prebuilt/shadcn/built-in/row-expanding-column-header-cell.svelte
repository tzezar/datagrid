<script lang="ts" generics="T">
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import LeafColumnCell from '../structure/leaf-column-cell.svelte';

	let { datagrid, column }: { datagrid: DataGrid<any>; column: LeafColumn<any> } = $props();



</script>

<LeafColumnCell {column} class="flex h-full items-center justify-center px-2 border-r ">
    <div>

    </div>
</LeafColumnCell>
