<script lang="ts">
	import type { AnyColumn } from '$lib/datagrid/core/types';
	import type { TzezarsDatagrid } from '../core/index.svelte';
	import type { ShadcnColumnMeta } from '../core/types';

	type Props = {
		datagrid: TzezarsDatagrid<any>;
		column: AnyColumn<any, ShadcnColumnMeta>;
	};
	let { datagrid, column }: Props = $props();

	const handleColumnFilterChange = (column: AnyColumn<any>, value: any) => {
		datagrid.handlers.filtering.updateFilterCondition({
			column,
			value
		});
		datagrid.cache.invalidate('filteredData');
		datagrid.features.pagination.goToFirstPage();
		datagrid.processors.data.executeFullDataTransformation();
		datagrid.features.columnFaceting.calculateFacets(
			datagrid.initial.data || [],
			datagrid.columns
		);
	};


</script>

{#snippet FilterOperator()}
	<span class="text-muted-foreground text-[0.5rem]"
		>Filter mode: {datagrid.features.filtering.getConditionOperator(column.columnId)}</span
	>
{/snippet}

{#if column.options.filterable !== false}
	{#if column?._meta?.filterType === 'number'}
		<input
			type="number"
			class="column-filter-input w-full"
			min={datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.min}
			max={datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.max}
			value={datagrid.features.filtering.getConditionValue(column.columnId)}
			onchange={(e) => {
				let minValue = datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.min;
				let maxValue = datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.max;

				let value = e.currentTarget.value === '' ? null : +e.currentTarget.value;
				if (value !== null && value < minValue) {
					value = minValue;
					e.currentTarget.value = String(value)
				}
				if (value !== null && value > maxValue) {
					value = maxValue;
					e.currentTarget.value = String(value)
				}

				handleColumnFilterChange(column, value);
			}}
		/>
		Min: {datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.min}
		Max: {datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.max}
	{/if}
	{#if column?._meta?.filterType === 'text'}
		<select
			class="column-filter-input w-full"
			value={datagrid.features.filtering.getConditionValue(column.columnId)}
			oninput={(e) => {
				handleColumnFilterChange(column, e.currentTarget.value);
			}}
		>
			<option value=""></option>
			{#each datagrid.features.columnFaceting.getCategoricalFacet(column.columnId).uniqueValues as option}
				<option value={option}>{option}</option>
			{/each}
		</select>
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
			{#each column._meta.filterOptions || [] as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
		{@render FilterOperator()}
	{/if}
{/if}
