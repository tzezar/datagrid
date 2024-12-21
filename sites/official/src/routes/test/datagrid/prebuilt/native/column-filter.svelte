<script lang="ts">
	import type { AnyColumn } from '../../core/helpers/column-creators';
	import type { Datagrid } from '../../core/index.svelte';

	type Props = {
		datagrid: Datagrid<any>;
		column: AnyColumn<any>;
	};
	let { datagrid, column }: Props = $props();
</script>

{#if column.options.filterable !== false}
	{#if column?._meta?.filterType === 'number'}
		<input
			type="number"
			class="column-filter-input w-full"
			value={datagrid.filtering.getConditionValue(column.columnId)}
			oninput={(e) => {
				const value = e.currentTarget.value === '' ? null : +e.currentTarget.value;
				datagrid.filtering.updateFilterCondition({
					column,
					value
				});
				datagrid.executeFullDataTransformation();
				datagrid.recomputeFacetedValues(datagrid.filteredOriginalRowsCache, datagrid.columns);
			}}
		/>
	{/if}
	{#if column?._meta?.filterType === 'text'}
		<input
			type="text"
			class="column-filter-input w-full"
			value={datagrid.filtering.getConditionValue(column.columnId)}
			oninput={(e) => {
				datagrid.filtering.updateFilterCondition({
					column,
					value: e.currentTarget.value
				});
				datagrid.executeFullDataTransformation();
				datagrid.recomputeFacetedValues(datagrid.filteredOriginalRowsCache, datagrid.columns);
			}}
		/>
	{/if}
	{#if column?._meta?.filterType === 'select'}
		<select
			class="w-full"
			value={datagrid.filtering.getConditionValue(column.columnId)}
			oninput={(e) => {
				datagrid.filtering.updateFilterCondition({
					column,
					value: e.currentTarget.value
				});
				datagrid.executeFullDataTransformation();
				datagrid.recomputeFacetedValues(datagrid.filteredOriginalRowsCache, datagrid.columns);
			}}
		>
			<option value=""></option>
			{#each column._meta.filterOptions as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	{/if}
{/if}


