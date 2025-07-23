import { type ColumnDef } from '$lib/datagrid/core/types';
import { accessorColumn } from '$lib/datagrid/core/column-creation';
import type { InventoryItem } from '$lib/data-generators/generate/inventory';
import type { ColumnMetaEnhanced } from '$lib/datagrid-enhanced/core/types';

export const columns = [
	accessorColumn({
		accessorKey: 'id',
		align: 'left'
	}),
	accessorColumn({
		accessorKey: 'name'
	}),
	accessorColumn({
		accessorKey: 'category'
	})
] satisfies ColumnDef<InventoryItem, ColumnMetaEnhanced<InventoryItem>>[];
