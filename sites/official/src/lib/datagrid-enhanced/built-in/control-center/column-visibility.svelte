<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Visibility from '$lib/datagrid/icons/material-symbols/visibility.svelte';
	import VisibilityOff from '$lib/datagrid/icons/material-symbols/visibility-off.svelte';
	import type { TzezarsDatagrid } from '../../core/index.svelte';
	import type { LeafColumn } from '$lib/datagrid/core/types';

	type Props = {
		datagrid: TzezarsDatagrid<any>;
	};

	let { datagrid }: Props = $props();
    
</script>

<DropdownMenu.Sub>
	<DropdownMenu.SubTrigger closeOnSelect={false}>
		<Visibility class="mr-2 size-4" />
		<span>Visibility</span>
	</DropdownMenu.SubTrigger>
	<DropdownMenu.SubContent>
		{#each datagrid.columnManager
			.getLeafColumnsInOrder()
			.filter((col: LeafColumn<any>) => col.options.hideable !== false) as column (column.columnId)}
			<DropdownMenu.Item
				disabled={column.options.hideable === false}
				class={`${column.state.visible === true ? 'text-primary' : 'text-muted-foreground'}`}
				closeOnSelect={false}
				onclick={() => datagrid.handlers.columnVisibility.toggleColumnVisibility(column.columnId)}
			>
				<span>
					{column.header}
				</span>
				<span class="ml-auto">
					{#if column.state.visible === true}
						<Visibility class="mr-2 size-4" />
					{:else}
						<VisibilityOff class="mr-2 size-4" />
					{/if}
				</span>
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.SubContent>
</DropdownMenu.Sub>
