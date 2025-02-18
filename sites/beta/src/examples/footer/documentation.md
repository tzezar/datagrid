---
title: Footer
date: '2024-10-15'
published: true
---

<script>
  import Datagrid from './datagrid.svelte'
  import DatagridCustomFooter from './datagrid-custom-footer.svelte'
</script>

<Datagrid />

## Implementation

```ts
options: {
	footer: { display: true }
}
```

## Code

### Datagrid component

```svelte
<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';

	let datagrid = setContext(
		'datagrid',
		new TzezarDatagrid({
			data: data.slice(0, 35),
			columns,
			options: {
				pagination: { display: false },
				footer: { display: true }
			}
		})
	);
</script>

<Datagrid.Datagrid class={{wrapper: 'max-h-[600px]'}}>
	{#snippet head()}
		{#each datagrid.columns as column (column.id)}
			<Datagrid.Header {column} />
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.data as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					<Datagrid.Cell {column} {row} {columnIndex} {rowIndex} />
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>

```

---

## Custom footer

<DatagridCustomFooter/>

## Implementation

```ts
options: {
	footer: { display: true }
}
```

### Create footer

and place it into `footer` snippet

```svelte
{#snippet footer()}
	<div data-datagrid-footer-identifier={datagrid.identifier}>
		FOOTER CONTENT
	</div>
{/snippet}
```

> Add `data-datagrid-footer-identifier={datagrid.identifier}`

## Code

### Datagrid component

```svelte
<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';

	let datagrid = setContext(
		'datagrid',
		new TzezarDatagrid({
			data: data.slice(0, 20),
			columns,
			options: {
				pagination: { display: false },
				footer: { display: true }
			}
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
		{#each datagrid.data as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					<Datagrid.Cell {column} {row} {columnIndex} {rowIndex} />
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
	{#snippet footer()}
		<div
			class="grid grid-cols-3 items-center p-2 pl-3"
			data-datagrid-footer-identifier={datagrid.identifier}
		>
			<span>
				Showing {datagrid.state.processedData.length * datagrid.state.pagination.page -
					datagrid.state.pagination.perPage}
				:
				{datagrid.state.processedData.length * datagrid.state.pagination.page}
				of
				{datagrid.state.pagination.count}
			</span>
			<div class="flex items-center justify-center">CUSTOM FOOTER</div>
			<span class="flex justify-end">Page {datagrid.state.pagination.page}</span>
		</div>
	{/snippet}
</Datagrid.Datagrid>
```
