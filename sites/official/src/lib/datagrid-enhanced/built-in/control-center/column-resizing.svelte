<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Slider from '$lib/components/ui/slider/slider.svelte';
	import Width from '$lib/datagrid/icons/material-symbols/width.svelte';
	import type { EnhancedDatagrid } from '../../core/index.svelte';

	type Props = {
		datagrid: EnhancedDatagrid<any>;
	};

	let { datagrid }: Props = $props();

	const leafColumns = datagrid.columnManager.getLeafColumns();
</script>

<DropdownMenu.Sub>
	<DropdownMenu.SubTrigger>
		<Width class="mr-2 size-4" />
		<span>Resizing</span>
	</DropdownMenu.SubTrigger>
	<DropdownMenu.SubContent>
		{#each leafColumns as column}
			<DropdownMenu.Item closeOnSelect={false} class="flex flex-col">
				<span class=' w-full'>{column.header}</span>
				<Slider
					class="ml-auto"
					type="single"
					min={column.state.size.minWidth}
					max={column.state.size.maxWidth}
					value={column.state.size.width}
					onValueCommit={(value: number) => {
						if (datagrid.extra.features.columnSizing.columnResizeMode === 'standard') {
							datagrid.handlers.columnSizing.updateColumnSize(column.columnId, Number(value));
						}
					}}
					onValueChange={(value: number) => {
						if (datagrid.extra.features.columnSizing.columnResizeMode === 'fluid') {
							datagrid.handlers.columnSizing.updateColumnSize(column.columnId, Number(value));
						}
					}}
				/>
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.SubContent>
</DropdownMenu.Sub>
