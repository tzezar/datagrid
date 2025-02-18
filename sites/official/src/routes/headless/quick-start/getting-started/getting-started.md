---
title: Getting Started with Tzezar's Datagrid
---

<script>
import BasicDatagrid from './basic-datagrid.svelte';
import BasicDatagridFixed from './basic-datagrid-fixed.svelte';
import { inventoryData as data } from '$lib/data/data-storage.svelte';
</script>

# {title}

Welcome to the quick start guide for Tzezar's Datagrid Core! This guide will help you rapidly implement the headless version of the datagrid in your project.

## Quick Overview

Tzezar's Datagrid Core provides a flexible, headless implementation that lets you build powerful data tables without being constrained by specific UI frameworks. This guide covers:

1. Setting up your data
2. Defining columns
3. Creating a datagrid instance
4. Rendering your datagrid

Let's get started!

## 1. Setting Up Your Data

Every datagrid needs data to display. Here's a simple example:

```ts
const data = [
	{
		id: 1,
		name: 'Product',
		price: {
			retail: 20,
			currency: 'PLN'
		}
	}
];

// Define a type for better TypeScript support
type InventoryItem = {
	id: number;
	name: string;
	price: {
		retail: number;
		currency: string;
	};
};
```

## 2. Defining Columns

Columns define how your data is structured and displayed:

```ts
import {
	accessorColumn,
	columnGroup,
	computedColumn,
	displayColumn,
	type ColumnDef
} from '$lib/datagrid/index.js';

export const columns = [
	// Simple column using direct data access
	accessorColumn({
		accessorKey: 'id'
	}),

	// Group of related columns
	columnGroup({
		header: 'Product',
		columns: [
			accessorColumn({
				accessorKey: 'name'
			}),
			computedColumn({
				header: 'Price',
				getValueFn: (row) => `${row.price.retail} ${row.price.currency}`
			})
		]
	}),

	// Custom display column (e.g., for expansion controls)
	displayColumn({
		columnId: 'expansion',
		header: '',
		cell: () => '<div>+</div>'
	})
] satisfies ColumnDef<InventoryItem>[];
```

### Column Types Explained

1. `accessorColumn`: Displays data directly from your objects
2. `computedColumn`: Combines or transforms data from multiple fields
3. `displayColumn`: Shows custom content not tied to your data
4. `columnGroup`: Organizes columns into logical groups

> Tip: Add `satisfies ColumnDef<InventoryItem>[]` to get TypeScript IntelliSense support.

## 3. Creating a Datagrid Instance

Now that you have data and columns, create your datagrid:

```ts
import { DatagridCore } from '$lib/datagrid/index.js';

const datagrid = new DatagridCore({
	columns,
	data
});
```

## Customizing Your Datagrid

For basic needs, this configuration is sufficient. For more control, you can:

1. Set an initial state:

```ts
const datagrid = new DatagridCore({
	columns,
	data,
	initialState: {
		sorting: { sortBy: 'id', sortDirection: 'asc' },
		pagination: { page: 1, pageSize: 25 }
	}
});
```

2. Extend built-in features:

```ts
class MySortingFeature extends SortingFeature {
	// Override methods or add new functionality
	isColumnSorted(columnId, direction) {
		console.log('Custom sorting logic');
		return super.isColumnSorted(columnId, direction);
	}
}

const datagrid = new Grid.EnhancedCore({
	columns,
	data,
	features: {
		sorting: MySortingFeature
	}
});
```

## 4. Rendering Your Datagrid

Since this is a headless library, you have complete freedom over rendering. Here's a basic implementation using `<div>` elements:

```svelte
<div class="datagrid-wrapper">
	<div class="datagrid">
		<!-- Header -->
		<div class="datagrid-header">
			<div class="datagrid-row">
				{#each datagrid.columns.getLeafColumns() as column}
					<div class="datagrid-cell header-cell">
						{column.header}
					</div>
				{/each}
			</div>
		</div>

		<!-- Body -->
		<div class="datagrid-body">
			{#each datagrid.rows.getVisibleBasicRows() as row}
				<div class="datagrid-row">
					{#each datagrid.columns.getLeafColumns() as column}
						<div class="datagrid-cell">
							{getCellContent(column, row.original)}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>
```

### Using Custom Cell Rendering

For more complex cell content, you can use Svelte 5 snippets: 

```svelte
{#snippet CellRenderer(column: LeafColumn<any>, row: GridBasicRow<any>)}
	{@const cellContent = column.cell ? column.cell({ datagrid, column, row }) : null}
	<div class="td">
		{#if cellContent}
			{#if typeof cellContent === 'string'}
				{@html cellContent}
			{:else if isCellComponent(cellContent)}
				<cellContent.component {datagrid} {row} {column} />
			{/if}
		{:else}
			<span>
				{@html getCellContent(column, row.original)}
			</span>
		{/if}
	</div>
{/snippet}
```

or prebuilt component:

```svelte
<script lang='ts'>
	import RenderCell from '$lib/datagrid/prebuilt/render-cell'
</script>

<div class="datagrid-body">
	{#each datagrid.rows.getVisibleBasicRows() as row}
		<div class="datagrid-row">
			{#each datagrid.columns.getLeafColumns() as column}
				<div class="datagrid-cell">
					<RenderCell {datagrid} {row} {column} />
				</div>
			{/each}
		</div>
	{/each}
</div>
```

Built-in `<RenderCell />` component makes rendering custom cell content straightforward.

### Why Use `<div>` Instead of `<table>`?

While traditional HTML tables work for simple cases, `<div>`-based structures offer significant advantages:

1. Better styling flexibility with CSS Grid and Flexbox
2. Improved performance for large datasets through virtual scrolling
3. Custom scroll behavior for features like sticky headers
4. More control over column resizing and reordering
5. Better integration with modern JavaScript frameworks

## Next Steps

Congratulations on setting up your first Tzezar's Datagrid! From here, you can:

1. Explore the API reference for detailed documentation
2. Check out examples for common patterns and advanced usage.
3. Try the Enhanced Datagrid if you need a ready-made component with built-in UI and some abstraction layer

## Advanced Features

Tzezar's Datagrid Core comes with powerful features you can tap into:

```ts
// Listen to events
datagrid.events.on('onColumnSort', ({ column }) => {
	console.log(`Column ${column.id} was sorted`);
});

// Use lifecycle hooks for custom processing
datagrid.hooks.registerHook('PRE_PROCESS_DATA', (data) => {
	// Modify or filter data before processing
	return data.filter((item) => item.active);
});
```

---

<br/>

Ready to build powerful, flexible data grids? Dive deeper into the documentation or check out the examples to see what Tzezar's Datagrid can do for your project!
