<script lang="ts" generics="T">
	import type { FilterOperator } from '$lib/datagrid/features/filtering-manager.svelte';
	import type { Column } from '$lib/datagrid/processors/column-processor.svelte';
	import type { Datagrid } from '$lib/datagrid/index.svelte';
	import Delete from '$lib/icons/delete.svelte';

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

	let { grid, column }: { grid: Datagrid<T, any>; column: Column<T> } = $props();
	// here you can set default filter option, "equals" or "contains" are good candidates
	let currentOperator = $state(grid.filtering.getConditionOperator(column.columnId) || column._meta.currentOperator ||'contains');
	let currentValue = $state(grid.filtering.getConditionValue(column.columnId) || '');
	let currentValueTo = $state(grid.filtering.getConditionValueTo(column.columnId) || '');

	const availableOperators = FILTER_OPERATORS.filter(
		(op) => !column._meta?.operators || column._meta.operators.includes(op.value)
	).filter((op) => op.type.includes(column._meta?.type));
	console.log($state.snapshot(column));
	console.log(availableOperators);

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

<div class="flex h-full w-full items-start">
	<div class="filter-container h-full max-w-20 items-center justify-center">
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
						{#each column?.faceting?.uniqueValues as opt}
							<option value={opt}>{opt}</option>
						{/each}
					</select>
				{/if}
			{:else if column._meta?.type === 'numeric-facet'}
				<input
					min={column.faceting?.type === 'numeric' ? column.faceting?.min : 0}
					type={column._meta?.type === 'number' ? 'number' : 'text'}
					class="filter-input"
					placeholder={`Min: ${column.faceting?.type === 'numeric' ? String(column.faceting?.min) : "0"}`}

					value={currentValue}
					oninput={handleValueChange}
				/>

				<input
					type={column._meta?.type === 'number' ? 'number' : 'text'}
					class="filter-input"
					placeholder={`Max: ${column.faceting?.type === 'numeric' ? String(column.faceting?.max) : "0"}`}
					value={currentValueTo}
					oninput={handleValueToChange}
				/>
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

		<button class="clear-button mt-auto" onclick={clearFilter}><Delete /></button>
	</div>
</div>

<style>
	.filter-container {
		@apply flex flex-col gap-1;
	}

	.filter-select {
		@apply h-6 w-full rounded border text-xs;
		border-color: var(--grid-border/1);
	}

	.filter-input {
		@apply h-6 w-full rounded border px-2 text-xs;
		border-color: var(--grid-border/1);
	}

	.clear-button {
		@apply bg-primary hover:bg-primary flex h-6 w-full items-center justify-center rounded px-2 text-xs text-gray-700;
		border-color: var(--grid-border/1);
	}
</style>
