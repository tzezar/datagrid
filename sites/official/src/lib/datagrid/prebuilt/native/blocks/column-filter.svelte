<script lang="ts">
	import type { DatagridCore } from '$lib/datagrid/core/index.svelte';
	import type { LeafColumn } from '$lib/datagrid/core/types';

	type Props = {
		datagrid: DatagridCore<any>;
		column: LeafColumn<any>;
	};
	let { datagrid, column }: Props = $props();

	const handleColumnFilterChange = (column: LeafColumn<any>, value: any) => {
		datagrid.handlers.filtering.updateFilterCondition({
			column,
			value
		});
	};
</script>

{#snippet FilterOperator()}
	<span class="text-[0.5rem] text-muted-foreground"
		>Filter mode: {datagrid.features.filtering.getConditionOperator(column.columnId)}</span
	>
{/snippet}

{#if column.options.filterable !== false}
	{#if column?._meta?.filterType === 'number'}
		<input
			type="number"
			class="column-filter-input w-full"
			value={datagrid.features.filtering.getConditionValue(column.columnId)}
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
			value={datagrid.features.filtering.getConditionValue(column.columnId)}
			oninput={(e) => {
				handleColumnFilterChange(column, e.currentTarget.value);
			}}
		/>
		{@render FilterOperator()}
	{/if}
	{#if column?._meta?.filterType === 'select'}
		<select
			class="column-filter-input w-full"
			value={datagrid.features.filtering.getConditionValue(column.columnId)}
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
