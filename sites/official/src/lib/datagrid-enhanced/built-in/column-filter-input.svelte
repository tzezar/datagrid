<script lang="ts">
	import type { DatagridCore } from '$lib/datagrid';
	import type { EnhancedMeta } from '$lib/datagrid-enhanced';
	import type { FilterOperator, LeafColumn } from '$lib/datagrid/core/types';

	type Props = {
		datagrid: DatagridCore<any>;
		column: LeafColumn<any>;
	};
	let { datagrid, column }: Props = $props();

	const handleColumnFilterChange = (
		column: LeafColumn<any, EnhancedMeta>,
		value: any,
		valueTo?: any,
		operator?: FilterOperator
	) => {
		datagrid.handlers.filtering.updateFilterCondition({
			column,
			value,
			operator: operator || 'contains',
			valueTo: valueTo
		});
	};
</script>

<!-- TODO - Rewrite this, I dont have time right now; this is ugly -->

{#snippet FilterOperator()}
	<span class="text-[0.5rem] text-muted-foreground">
		Filter mode: {datagrid.features.filtering.getConditionOperator(column.columnId)}</span
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
					// if (value !== null && value < minValue) {
					// 	value = minValue;
					// 	e.currentTarget.value = String(value);
					// }
					// if (value !== null && value > maxValue) {
					// 	value = maxValue;
					// 	e.currentTarget.value = String(value);
					// }

					handleColumnFilterChange(column, value, null, 'contains');
				}}
			/>
			<div class="flex flex-col justify-between">
				{@render FilterOperator()}
				<span class="text-[0.5rem] text-muted-foreground">
					Min: {datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.min}
					Max: {datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.max}
				</span>
			</div>
		{/if}
	{/if}
	{#if column?._meta?.filterType === 'range'}
		{#if column.options.calculateFacets === false}
			<div class="flex gap-1">
				<input
					type="number"
					class="grid-head-row-leaf-column-filter-input"
					value={datagrid.features.filtering.getConditionValue(column.columnId)}
					onchange={(e) => {
						let value = e.currentTarget.value === '' ? null : +e.currentTarget.value;

						const valueTo =
							datagrid.features.filtering.getConditionValueTo(column.columnId) ?? Infinity;

						handleColumnFilterChange(column, value, valueTo, 'between');
					}}
				/>

				<input
					type="number"
					class="grid-head-row-leaf-column-filter-input"
					min={datagrid.features.filtering.getConditionValue(column.columnId)}
					value={datagrid.features.filtering.getConditionValueTo(column.columnId)}
					onchange={(e) => {
						let valueTo = e.currentTarget.value === '' ? null : +e.currentTarget.value;
						const value = datagrid.features.filtering.getConditionValue(column.columnId) ?? 0;

						if (valueTo !== null && valueTo < value) {
							valueTo = value;
						}

						handleColumnFilterChange(column, value, valueTo, 'between');
					}}
				/>
			</div>
			<div class="flex justify-between">
				{@render FilterOperator()}
			</div>
		{:else}
			<div class="flex gap-1">
				<input
					type="number"
					class="grid-head-row-leaf-column-filter-input"
					min={datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.min}
					value={datagrid.features.filtering.getConditionValue(column.columnId)}
					onchange={(e) => {
						let value = e.currentTarget.value === '' ? null : +e.currentTarget.value;

						const valueTo =
							datagrid.features.filtering.getConditionValueTo(column.columnId) ?? Infinity;

						handleColumnFilterChange(column, value, valueTo, 'between');
					}}
				/>

				<input
					type="number"
					class="grid-head-row-leaf-column-filter-input"
					max={datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.max}
					value={datagrid.features.filtering.getConditionValueTo(column.columnId)}
					onchange={(e) => {
						let minValue = datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.min;
						let maxValue = datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.max;

						let valueTo = e.currentTarget.value === '' ? null : +e.currentTarget.value;
						const value = datagrid.features.filtering.getConditionValue(column.columnId) ?? 0;

						if (valueTo !== null && valueTo < value) {
							valueTo = value;
						}

						handleColumnFilterChange(column, value, valueTo, 'between');
					}}
				/>
			</div>
			<div class="flex flex-col justify-between">
				{@render FilterOperator()}
				<span class="text-[0.5rem] text-muted-foreground">
					Min: {datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.min}
					Max: {datagrid.features.columnFaceting.getNumericFacet(column.columnId)?.max}
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
				{#each datagrid.features.columnFaceting.getCategoricalFacet(column.columnId)?.uniqueValues ?? [] as option}
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
				{#each datagrid.features.columnFaceting.getCategoricalFacet(column.columnId)?.uniqueValues ?? [] as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		{/if}
	{/if}
{/if}

<style lang='postcss'>
	.grid-head-row-leaf-column-filter-input {
		@apply h-6 w-full rounded-sm px-0 py-1 text-xs;
		color: hsl(var(--muted-foreground));
	}
</style>
