<script lang="ts">
	import type { AnyColumn } from '$lib/datagrid/core/column-creation/types';
	import type { Datagrid } from '../../core/index.svelte';

	type Props = {
		datagrid: Datagrid<any>;
		column: AnyColumn<any>;
	};
	let { datagrid, column }: Props = $props();

	const handleColumnFilterChange = (column: AnyColumn<any>, value: any) => {
		datagrid.handlers.filtering.updateFilterCondition({
			column,
			value
		});
		datagrid.cache.invalidateFilteredDataCache();
		datagrid.pagination.goToFirstPage();
		datagrid.processors.data.executeFullDataTransformation();
		datagrid.columnFaceting.calculateFacets(datagrid.cache.sortedData || [], datagrid.columns);
	};
</script>

{#snippet FilterOperator()}
	<span class="text-muted-foreground text-[0.5rem]">Filter mode: equals</span>
{/snippet}

{#if column.options.filterable !== false}
	{#if column?._meta?.filterType === 'number'}
		<input
			type="number"
			class="column-filter-input w-full"
			value={datagrid.filtering.getConditionValue(column.columnId)}
			oninput={(e) => {
				const value = e.currentTarget.value === '' ? null : +e.currentTarget.value;
				handleColumnFilterChange(column, value);
			}}
		/>
		{@render FilterOperator()}
	{/if}
	{#if column?._meta?.filterType === 'text'}
		<input
			type="text"
			class="column-filter-input w-full"
			value={datagrid.filtering.getConditionValue(column.columnId)}
			oninput={(e) => {
				handleColumnFilterChange(column, e.currentTarget.value);
			}}
		/>
		{@render FilterOperator()}
	{/if}
	{#if column?._meta?.filterType === 'select'}
		<select
			class="column-filter-input w-full"
			value={datagrid.filtering.getConditionValue(column.columnId)}
			oninput={(e) => {
				handleColumnFilterChange(column, e.currentTarget.value);
			}}
		>
			<option value=""></option>
			{#each column._meta.filterOptions as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
		{@render FilterOperator()}
	{/if}
{/if}
