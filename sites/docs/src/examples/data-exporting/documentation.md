---
title: Data exporting
description: First post.
date: '2024-10-15'
published: true
---

<script>
  import Datagrid from './datagrid.svelte'
</script>

<Datagrid />

## Implementation

Work in progress. See the code below.

## Code

### Column definitions

```ts
import type { BaseColumn } from "$lib/datagrid/types";
import type { InventoryDataRow } from "$lib/data/inventory";

export const columns = [
    {
        id: 'product.name',
        title: 'Product name',
        sortable: true,
        grow: true,
        filterType: 'string',
        filterValue: '',
    },
    {
        id: 'price',
        title: 'Price',
        sortable: true,
        filterType: 'range',
        filterValue: [-99999999999, 9999999999],
        align: 'end',
    },
    {
        id: 'quantity',
        title: 'Quantity',
        sortable: true,
        filterType: 'number',
        filterValue: '',
        align: 'end',

    },
    {
        id: 'category',
        title: 'Category',
        filterType: 'select',
        filterValue: '',
        options: [
            { label: 'Everything', value: '' },
            { label: 'Furniture', value: 'furniture' },
            { label: 'Clothing', value: 'clothing' },
            { label: 'Electronics', value: 'electronics' }
        ],
    },
    {
        id: 'expiration_date',
        title: 'Expiration date',
        filterType: 'date',
        filterValue: '',
    },
] satisfies BaseColumn<InventoryDataRow>[]
```

### Datagrid component

```svelte
<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';

	let datagrid = setContext(
		`datagrid`,
		new TzezarDatagrid({
			data,
			columns,
			options: {
				exportFileName: 'this_is_awesome',
				topbar: {
					display: true,
					displayExportDataMenu: true
				}
			}
		})
	);
</script>

<Datagrid.Datagrid>
	{#snippet head()}
		{#each datagrid.columns as column, i (column.id)}
			<Datagrid.Header {column} class={{ header: '' }}>
				{#snippet filter()}
					<Datagrid.ColumnFilter {column} />
				{/snippet}
			</Datagrid.Header>
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.internal.paginatedData as row, rowIndex}
			<Datagrid.Row rowId={row.id} {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					{@const props = { row, rowIndex, column, columnIndex }}
					{#if column.id === 'product.name'}
						<Datagrid.Cell
							class={{ data: 'overflow-hidden text-ellipsis text-nowrap' }}
							{...props}
						/>
					{:else}
						<Datagrid.Cell {...props} />
					{/if}
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
```
