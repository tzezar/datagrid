<script lang="ts">
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { columnsWithGetters } from '$lib/datagrid/core/constants';

	let { datagrid }: { datagrid: DataGrid<any> } = $props();

	let columns = $derived(
		datagrid.columnManager
			.getFlatColumns()
			.filter((col) => columnsWithGetters.includes(col.type as (typeof columnsWithGetters)[number]))
			.filter((col) => col.options.groupable === true)
	);
	
</script>

<Select.Root
	type="multiple"
	name="groupByColumn"
	value={datagrid.grouping.groupByColumns}
	onValueChange={(values) => datagrid.handlers.grouping.change(values)}
>
	<Select.Trigger class="h-full w-full rounded-none">Group data by column</Select.Trigger>
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