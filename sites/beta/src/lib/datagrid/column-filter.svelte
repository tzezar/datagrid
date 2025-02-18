<script lang="ts">
	import DateFilter from './native/date-filter.svelte';
	import NumberFilter from './native/number-filter.svelte';
	import RangeFilter from './native/range-filter.svelte';
	import SelectFilter from './native/select-filter.svelte';
	import TextFilter from './native/text-filter.svelte';
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
	<DateFilter columnId={column.id} />
{/if}
{#if column.filterType === 'select' && column.options}
	<SelectFilter columnId={column.id}  options={column.options} />
{/if}
{#if column.filterType === 'range'}
	<RangeFilter columnId={column.id}  {column} />
{/if}
{#if column.filterType === 'number'}
	<NumberFilter columnId={column.id}  />
{/if}
