<script lang="ts">
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { columnsWithGetters } from '$lib/datagrid/core/constants';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	let { datagrid }: { datagrid: Datagrid<any> } = $props();

	let columns = $derived(
		datagrid.columnManager
			.getFlatColumns()
			.filter((col) => columnsWithGetters.includes(col.type as (typeof columnsWithGetters)[number]))
			.filter((col) => col.options.groupable === true)
	);

	const getColumnById = (columnId: string) => {
		return datagrid.columnManager.getFlatColumns().find((col) => col.columnId === columnId);
	};
	const getColumnHeaders = () => {};
</script>

<Select.Root
	type="multiple"
	name="groupByColumn"
	value={datagrid.features.grouping.groupByColumns}
	onValueChange={(values) => datagrid.handlers.grouping.change(values)}
>
	<Select.Trigger class="flex h-full w-full gap-x-2 gap-y-2 rounded-none border-0">
		{#if datagrid.features.grouping.groupByColumns.length === 0}
			<span>Select columns</span>
		{:else}
			<div class='flex h-full w-full flex-wrap gap-2'>
				{#each datagrid.features.grouping.groupByColumns as columnId}
					<Badge class='flex  text-center self-center items-center justify-center'>{getColumnById(columnId)?.header}</Badge>
				{/each}
			</div>
		{/if}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.GroupHeading>Columns</Select.GroupHeading>
			{#each columns as column}
				<Select.Item value={column.columnId} label={column.header}>
					{column.header}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
