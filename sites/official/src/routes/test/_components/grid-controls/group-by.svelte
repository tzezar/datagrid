<script lang="ts">
	import type { Datagrid } from '../../datagrid/core/index.svelte';
	import type { ColumnId } from '../../datagrid/core/types';
	import { findColumnById, flattenColumns } from '../../datagrid/core/utils.svelte';

	let { datagrid }: { datagrid: Datagrid<any> } = $props();

	function handleGroupByChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		const selectedOptions = Array.from(select.selectedOptions);

		const newGroupBy: ColumnId[] = selectedOptions
			.map((option) => {
				const column = findColumnById(datagrid.columns, option.value);
				if (!column) return null;
				if (column.options.groupable === false) return null;
				return option.value;
			})
			.filter((group): group is ColumnId => group !== null); // Type guard to filter out null values

		datagrid.grouping.groupByColumns = newGroupBy;
		datagrid.pagination.goToFirstPage();
		datagrid.cache.invalidateGroupedRowsCache();
		datagrid.processors.data.executeFullDataTransformation();
	}
</script>

<div class="flex flex-col gap-2 pb-6">
	<label for="groupBy">Group by:</label>
	<select
		multiple
		value={datagrid.grouping.groupByColumns}
		onchange={(e) => handleGroupByChange(e)}
		id="groupBy"
		style={`border-radius: 0.25rem;
		border: 1px solid hsl(var(--grid-border));
		padding: 0 0.5rem;
		height: 140px;
		`}
	>
		{#each flattenColumns(datagrid.columns).filter(col => col.type !== 'group') as column}
			<option value={column.columnId} disabled={column?.options?.groupable === false}>
				{column.header}
			</option>
		{/each}
	</select>
</div>
