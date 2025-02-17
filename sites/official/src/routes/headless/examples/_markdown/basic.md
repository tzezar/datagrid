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
