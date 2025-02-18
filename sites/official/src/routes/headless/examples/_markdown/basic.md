---
title: Basic datagrid example
---

<script>
import BasicDatagrid from '../_datagrids/basic/basic-datagrid.svelte';
import { inventoryData as data } from '$lib/data/data-storage.svelte';
</script>

# {title}

<BasicDatagrid {data} />

## Columns

```ts
export const columns = [
	accessorColumn({
		accessorKey: 'id'
	}),
	accessorColumn({
		accessorKey: 'name'
	}),
	accessorColumn({
		accessorKey: 'category'
	}),
	accessorColumn({
		accessorKey: 'price.retail'
	})
] satisfies ColumnDef<InventoryItem>[];
```

## Datagrid instance

```ts
const datagrid = new DatagridCore({
	columns,
	data
});
```

## HTML

```svelte
<div class="wrapper">
	<div class="table">
		<div class="thead">
			<div class="tr">
				{#each datagrid.columns.getLeafColumns() as column}
				<div class="th">{column.header}</div>
				{/each}
			</div>
		</div>
		<div class="tbody">
			{#each datagrid.rows.getVisibleBasicRows() as row}
			<div class="tr">
				{#each datagrid.columns.getLeafColumns() as column}
				<div class="td">{getCellContent(column, row.original)}</div>
				{/each}
			</div>
			{/each}
		</div>
	</div>
</div>
```
