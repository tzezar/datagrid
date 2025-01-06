<script lang="ts">
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import type { ColumnId } from '$lib/datagrid/core/types';
	import { findColumnById, flattenColumns } from '$lib/datagrid/core/utils.svelte';
	import * as Select from '$lib/components/ui/select/index.js';

	let { datagrid }: { datagrid: Datagrid<any> } = $props();

	function handleGroupByChange(values: string[]) {

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
		flattenColumns(datagrid.columns)
			.filter((col) => ['accessor', 'computed'].includes(col.type))
			.filter((col) => col.options.groupable === true)
	);
</script>



<Select.Root type="multiple" name="groupByColumn" value={datagrid.grouping.groupByColumns} onValueChange={(values) => handleGroupByChange(values)}>
	<Select.Trigger class="w-[180px] rounded-none border-l-0 border-b-0">
		Group data by column
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
