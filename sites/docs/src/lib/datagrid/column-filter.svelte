<script lang="ts">
	import DateFilter from './filters/date-filter.svelte';
	import NumberFilter from './filters/number-filter.svelte';
	import RangeFilter from './filters/range-filter.svelte';
	import SelectFilter from './filters/select-filter.svelte';
	import TextFilter from './filters/text-filter.svelte';
	import type { BaseColumn } from './types';

	let {
		column,
	}: {
		column: BaseColumn;
	} = $props();

</script>

{#if column.filterType === 'string'}
	<TextFilter columnId={column.id}  />
{/if}
{#if column.filterType === 'date'}
	<DateFilter field={column.id} />
{/if}
{#if column.filterType === 'select' && column.options}
	<SelectFilter field={column.id}  options={column.options} />
{/if}
{#if column.filterType === 'range'}
	<RangeFilter columnId={column.id}  {column} />
{/if}
{#if column.filterType === 'number'}
	<NumberFilter columnId={column.id}  />
{/if}
