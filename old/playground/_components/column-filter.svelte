<script lang="ts">
	import type { FilterOperator } from '$lib/tzezars-datagrid/features/filtering-manager.svelte';
	import type { Column } from '$lib/tzezars-datagrid/processors/column-processor.svelte';
	import type { Datagrid } from '$lib/tzezars-datagrid/index.svelte';

	type FilterType = 'text' | 'number' | 'select' | 'date';

	interface FilterOperatorOption {
		label: string;
		value: FilterOperator;
		type: FilterType[];
	}

	const FILTER_OPERATORS: FilterOperatorOption[] = [
		{ label: 'Equals', value: 'equals', type: ['text', 'number', 'select'] },
		{ label: 'Contains', value: 'contains', type: ['text'] },
		{ label: 'Starts with', value: 'startsWith', type: ['text'] },
		{ label: 'Ends with', value: 'endsWith', type: ['text'] },
		{ label: 'Greater than', value: 'greaterThan', type: ['number', 'date'] },
		{ label: 'Less than', value: 'lessThan', type: ['number', 'date'] },
		{ label: 'Between', value: 'between', type: ['number', 'date'] },
		{ label: 'Is empty', value: 'empty', type: ['text', 'number', 'date'] },
		{ label: 'Is not empty', value: 'notEmpty', type: ['text', 'number', 'date'] }
	];

	let { grid, column }: { grid: Datagrid; column: Column } = $props();

	let currentOperator = $state(grid.filtering.getConditionOperator(column.columnId) || 'equals');
	let currentValue = $state(grid.filtering.getConditionValue(column.columnId) || '');
	let currentValueTo = $state(grid.filtering.getConditionValueTo(column.columnId) || '');

	const availableOperators = FILTER_OPERATORS.filter(
		(op) => !column._meta?.operators || column._meta.operators.includes(op.value)
	).filter((op) => op.type.includes(column._meta?.type));

	function handleOperatorChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		currentOperator = select.value as FilterOperator;
		grid.refresh(() => {
			applyFilter();
		});
	}

	function handleValueChange(event: Event) {
		const input = event.target as HTMLInputElement;
		currentValue = input.value;
		grid.refresh(() => {
			applyFilter();
		});
	}

	function handleValueToChange(event: Event) {
		const input = event.target as HTMLInputElement;
		currentValueTo = input.value;
		grid.refresh(() => {
			applyFilter();
		});
	}

	function applyFilter() {
		const filterValue = column._meta?.type === 'number' ? +currentValue : currentValue;
		const filterValueTo = column._meta?.type === 'number' ? +currentValueTo : currentValueTo;

		grid.filtering.addFilter({
			accessor: column.accessor,
			columnId: column.columnId,
			operator: currentOperator,
			value: filterValue,
			...(currentOperator === 'between' && { valueTo: filterValueTo })
		});
		grid.pagination.goToPage(1);
		grid.dataProcessor.process();
	}

	function clearFilter() {
		currentOperator = 'equals';
		currentValue = '';
		currentValueTo = '';
		grid.refresh(() => {
			grid.filtering.removeFilter(column.columnId);
			grid.pagination.goToPage(1);
			grid.dataProcessor.process();
		});
	}
</script>

<div class="filter-container">
	{#if availableOperators.length > 1}
		<select class="filter-select" value={currentOperator} onchange={handleOperatorChange}>
			{#each availableOperators as op}
				<option value={op.value}>{op.label}</option>
			{/each}
		</select>
	{/if}

	{#if !['empty', 'notEmpty'].includes(currentOperator)}
		{#if column._meta?.type === 'select'}
			{#if column._meta?.options}
				<select class="filter-select" value={currentValue} onchange={handleValueChange}>
					<option value="">Select...</option>
					{#each column._meta.options as opt}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			{:else if column.faceting?.type === 'categorical'}
				<select class="filter-select" value={currentValue} onchange={handleValueChange}>
					<option value="">Select...</option>
					{#each column?.faceting?.uniqueValues as opt}
						<option value={opt}>{opt}</option>
					{/each}
				</select>
			{/if}
		{:else}
			<input
				type={column._meta?.type === 'number' ? 'number' : 'text'}
				class="filter-input"
				placeholder="Filter..."
				value={currentValue}
				oninput={handleValueChange}
			/>

			{#if currentOperator === 'between'}
				<input
					type={column._meta?.type === 'number' ? 'number' : 'text'}
					class="filter-input"
					placeholder="To..."
					value={currentValueTo}
					oninput={handleValueToChange}
				/>
			{/if}
		{/if}
	{/if}

	<button class="clear-button" onclick={clearFilter}>Clear</button>
</div>

<style>
	.filter-container {
		@apply flex flex-col gap-1 p-1;
	}

	.filter-select {
		@apply h-6 w-full rounded border border-gray-300 text-xs;
	}

	.filter-input {
		@apply h-6 w-full rounded border border-gray-300 px-2 text-xs;
	}

	.clear-button {
		@apply h-6 w-full rounded bg-gray-100 text-xs text-gray-700 hover:bg-gray-200;
	}
</style>
