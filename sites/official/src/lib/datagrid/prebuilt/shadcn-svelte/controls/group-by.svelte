<script lang="ts">
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import type { ColumnId, ColumnType } from '$lib/datagrid/core/types';
	import { findColumnById, flattenColumns } from '$lib/datagrid/core/utils.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { columnsWithGetters } from '$lib/datagrid/core/constants';

	let { datagrid }: { datagrid: Datagrid<any> } = $props();

	function handleGroupByChange(values: string[]) {
		console.log(values);

		const newGroupBy: ColumnId[] = values
			.map((option) => {
				const column = findColumnById(datagrid.columns, option);
				if (!column) return null;
				if (column.options.groupable === false) return null;
				return option;
			})
			.filter((group): group is ColumnId => group !== null); // Type guard to filter out null values

		datagrid.grouping.groupByColumns = newGroupBy;
		datagrid.pagination.goToFirstPage();
		datagrid.cache.invalidateGroupedRowsCache();
		datagrid.processors.data.executeFullDataTransformation();
	}


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
	onValueChange={(values) => handleGroupByChange(values)}
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
