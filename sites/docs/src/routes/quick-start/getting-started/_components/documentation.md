---
title: Getting started
date: '2024-10-15'
published: true
---

<script>
  import Datagrid from './datagrid.svelte'
</script>

On this page you will learn how to create a datagrid.

## Data

There is no datagrid without data! In order not to complicate this example, we will use
predefined data, which will look as follows:

```ts
{
    "index": 1,
    "product": {
        "name": "Sprouts - Onion"
    },
    "quantity": 972,
    "price": 261.51,
    "expiration_date": "7/14/2024",
    "manufacturer": "Green Factory",
    "category": "vegetables",
    "location": "Apt 1819",
    "barcode": 3056519006086,
    "weight": 25.6,
    "supplier": "Foodgast",
    "id": "a0473d74-06e7-4dd0-8bb3-a17f16c94180"
}
```

There are no special requirements how your data looks like, as you can see the data can be
nested, it does not have to be a flat structure.

## Defining columns

Second step in creating a datagrid will be to define columns.

```ts
import type { BaseColumn } from '$lib/datagrid/types';
import type { InventoryDataRow as Row } from '$lib/data/inventory';

export const columns = [
	{
		id: 'product.name',
		title: 'Product name',
		grow: true
	},
	{
		id: 'price',
		title: 'Price'
	}
] satisfies BaseColumn<Row>[];
```

`BaseColumn` is a generic type. Give it the your data shape to get
typesafety in column definition.

> Columns `id` and `title` are required

Datagrid columns does not always behave like table columns, they have specified width. You
can set your own width in columns definition with `width`. Eg. `width:"300px"`.

> You can also set default column width

```ts
options: {
  defaultColumnWidth: '200px',
}
```

In some scenarios I believe that adding `grow` to particular column is a better idea. Either first or last
column is good candidate, or you can make any other most important column grow to fill the available
space.

> You can specify `width` and `grow` to multiple columns

A good practice is to place the columns in a separate file. This makes our main component
look neater.

## Datagrid instance

Svelte 5 allows you to define stores outside of .svelte files as a class. Datagrid takes
advantage of this capability.

Import the class and create an instance of it inside the context.

```ts
import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';

let datagrid = setContext(
	'datagrid',
	new TzezarDatagrid({
		data,
		columns
	})
);
```

New instance of datagrid requires a `columns` and `data`.

As you will see typesafety is preserved during the creation of datagrid later in the code.

> context has to be named `datagrid`

## Rendering our datagrid

Now it's time to render our datagrid. Relax, it's easy.

```svelte
<Datagrid.Datagrid>
	{#snippet head()}
		{#each datagrid.columns as column (column.id)}
			<Datagrid.Header {column} />
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.internal.paginatedData as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					<Datagrid.Cell {columnIndex} {rowIndex} {column} {row} />
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
```

I'll explain what's going on here in a moment. I encourage you later to read the rest of
the documentation to more in-depth understand the operation and why it looks this way.

`<Datagrid.Datagrid>` contains the basic datagrid logic and styling to give the datagrid the
proper structure. It has two main slots: `head` and `body`.

Suprisingly, they are optional — let me explain. In the future, the datagrid will
support a headless mode, allowing for any arrangement of elements within the datagrid.
However, using the provided snippets is recommended (at least for now).

The `head` slot is used to render header elements, while the
`body` slot is used to render data elements. Inside `head`, we have the ability to display header cells, render custom elements, and show column filters.

So, for each header, we render a `<Datagrid.Header>` which contains styling and logic for things like sorting. `column` is typed, which will make things easier.

Inside the `body` slot, we display data cells. For each row, we display a `<Datagrid.Row>`.

> Notice that we used `datagrid.internal.paginatedData` and not our own data we provided, because the data logic is applied within the datagrid. At this point, I want you to know that the datagrid provides, among other things:

- `datagrid.internal.sortedData`
- `datagrid.internal.filteredData`
- `datagrid.internal.paginatedData`

The first two probably won't be often useful to you, but `datagrid.paginatedData` is used in `client mode` to display rows split into pages, with sorting and filtering logic applied.

Again, `<Datagrid.Row>` includes both styling and logic. Inside each row, we need to display the
corresponding data cells. Therefore, we iterate over `datagrid.columns`.

It is important to use the columns returned by the datagrid and not the ones we defined earlier. Then, we render a cell by passing a few props.

`<Datagrid.Cell>` is wrapped with logic, and even custom elements should later be displayed
inside it (or another sibling cell element - more later in docs).

Both row and column are typed, which significantly improves the developer experience
and makes applying custom styles easier. Check the feature guides to learn more
about rendering custom cells or how to apply logic and styles to selected cells or rows.

## Congratulations!

You've just built your first datagrid — what an achievement!

Creating a powerful and flexible
grid like this is a huge step forward, and you’ve done a fantastic job bringing it to life.

But this is just the beginning! There’s so much more you can do to enhance your datagrid.
The feature guides are packed with tips on how to customize cells, apply unique styles, and
introduce advanced logic to your rows and columns. The possibilities for fine-tuning and
optimizing your grid are endless.

So keep going! Experiment with new ideas, explore the documentation, and continue to build
upon what you’ve already accomplished. You’re on a great path, and I’m excited to see what
you’ll create next!

<Datagrid />

## Code

```svelte
<script lang="ts">
	import type { BaseColumn } from '$lib/datagrid/types';
	import type { InventoryDataRow as Row } from '$lib/data/inventory';
	import { setContext } from 'svelte';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import * as Datagrid from '$lib/datagrid';

	export const columns = [
		{
			id: 'product.name',
			title: 'Product name',
			grow: true
		},
		{
			id: 'price',
			title: 'Price'
		}
	] satisfies BaseColumn<Row>[];

	let datagrid = setContext(
		'datagrid',
		new TzezarDatagrid({
			data: data.splice(0, 100),
			columns
		})
	);
</script>

<Datagrid.Datagrid>
	{#snippet head()}
		{#each datagrid.columns as column (column.id)}
			<Datagrid.Header {column} />
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.internal.paginatedData as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					<Datagrid.Cell {columnIndex} {rowIndex} {column} {row} />
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
```
