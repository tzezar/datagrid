<script lang="ts">
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { AnyColumn } from '$lib/datagrid/core/types';
	import type { PinningPosition } from '$lib/datagrid/core/types';
    
	function handleColumnPinningChange(column: AnyColumn<any>, position: PinningPosition) {
		datagrid.handlers.columnPinning.changeColumnPinningPosition(column.columnId, position);
	}

	let { datagrid }: { datagrid: Datagrid<any> } = $props();
</script>

{#each datagrid.columnManager.getLeafColumnsInOrder() as column}
	<div class="flex flex-row gap-2">
		{column.header}

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

	</div>
{/each}
