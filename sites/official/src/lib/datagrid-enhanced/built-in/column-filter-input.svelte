<script lang="ts">
	import type { AnyColumn, LeafColumn } from '$lib/datagrid/core/types';
	import type { EnhancedDatagrid } from '../core/index.svelte';
	import type { ColumnMetaEnhanced } from '../core/types';

	type Props = {
		datagrid: EnhancedDatagrid<any>;
		column: LeafColumn<any, ColumnMetaEnhanced>;
	};
	let { datagrid, column }: Props = $props();

	const handleColumnFilterChange = (column: AnyColumn<any>, value: any) => {
		datagrid.handlers.filtering.updateFilterCondition({
			column,
			value
		});
		datagrid.cacheManager.invalidate('filteredData');
		datagrid.features.pagination.goToFirstPage();
		datagrid.processors.data.executeFullDataTransformation();
		datagrid.features.columnFaceting.calculateFacets(datagrid.originalState.data || [], datagrid._columns);
	};
</script>

{#snippet FilterOperator()}
	<span class="text-muted-foreground text-[0.5rem]"
		>Filter mode: {datagrid.features.filtering.getConditionOperator(column.columnId)}</span
	>
{/snippet}

{#if column.options.filterable !== false}
	{#if column?._meta?.filterType === 'number'}
		{#if column.options.calculateFacets === false}
			<input
				type="number"
				class="grid-head-row-leaf-column-filter-input"
				value={datagrid.features.filtering.getConditionValue(column.columnId)}
				onchange={(e) => {
					let value = e.currentTarget.value === '' ? null : +e.currentTarget.value;

					handleColumnFilterChange(column, value);
				}}
			/>
			<div class="flex justify-between">
				{@render FilterOperator()}
			</div>
		{:else}
			<input
				type="number"
				class="grid-head-row-leaf-column-filter-input"
				min={datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.min}
				max={datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.max}
				value={datagrid.features.filtering.getConditionValue(column.columnId)}
				onchange={(e) => {
					let minValue = datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.min;
					let maxValue = datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.max;

					let value = e.currentTarget.value === '' ? null : +e.currentTarget.value;
					if (value !== null && value < minValue) {
						value = minValue;
						e.currentTarget.value = String(value);
					}
					if (value !== null && value > maxValue) {
						value = maxValue;
						e.currentTarget.value = String(value);
					}

					handleColumnFilterChange(column, value);
				}}
			/>
			<div class="flex justify-between">
				{@render FilterOperator()}
				<span class="text-muted-foreground text-[0.5rem]">
					Max: {datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.max}
					Min: {datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.min}
				</span>
			</div>
		{/if}
	{/if}
	{#if column?._meta?.filterType === 'text'}
		{#if column.options.calculateFacets === false}
			<input
				type="text"
				class="grid-head-row-leaf-column-filter-input"
				value={datagrid.features.filtering.getConditionValue(column.columnId)}
				onchange={(e) => {
					let value = e.currentTarget.value === '' ? null : e.currentTarget.value;
					handleColumnFilterChange(column, value);
				}}
			/>
		{:else}
			<select
				class="grid-head-row-leaf-column-filter-input"
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
		<div class="flex">
			{@render FilterOperator()}
		</div>
	{/if}
	{#if column?._meta?.filterType === 'select'}
		{#if column.options.calculateFacets === false}
			<select
				class="grid-head-row-leaf-column-filter-input"
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
			<div class="flex">
				{@render FilterOperator()}
			</div>
		{:else}
			<select
				class="grid-head-row-leaf-column-filter-input"
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
	{/if}
{/if}
