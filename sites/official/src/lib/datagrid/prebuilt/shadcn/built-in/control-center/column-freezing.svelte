<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { TzezarsDatagrid } from '../../core/index.svelte';
	import StabilizationLock from '$lib/datagrid/icons/material-symbols/stabilization-lock.svelte';
	import type { AnyColumn, PinningPosition } from '$lib/datagrid/core/types';
	import * as Select from '$lib/components/ui/select/index.js';

	type Props = {
		datagrid: TzezarsDatagrid<any>;
	};

	let { datagrid }: Props = $props();

	const leafColumns = datagrid.columnManager.getLeafColumns();

	function handleColumnPinningChange(column: AnyColumn<any>, position: PinningPosition) {
		datagrid.handlers.columnPinning.changeColumnPinningPosition(column.columnId, position);
	}


</script>

<DropdownMenu.Sub>
	<DropdownMenu.SubTrigger>
		<StabilizationLock class="mr-2 size-4" />
		<span>Freezing</span>
	</DropdownMenu.SubTrigger>
	<DropdownMenu.SubContent>
		{#each leafColumns as column}
			<DropdownMenu.Item closeOnSelect={false} class="flex flex-col flex-nowrap gap-2">
				<span class='w-full'>{column.header}</span>
				<Select.Root
					type="single"
					name="pinningPosition"
					value={column.state.pinning.position}
					disabled={column.options.pinnable === false}
					onValueChange={(value: string) =>
						handleColumnPinningChange(column, value as PinningPosition)}
				>
					<Select.Trigger class="ml-auto w-[180px]" disabled={column.options.pinnable === false}>
						{column.state.pinning.position}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Item value={'none'}>none</Select.Item>
							<Select.Item value={'left'}>left</Select.Item>
							<Select.Item value={'right'}>right</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.SubContent>
</DropdownMenu.Sub>
