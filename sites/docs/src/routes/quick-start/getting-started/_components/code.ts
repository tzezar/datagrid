export const code = {
    instance: `let datagrid = setContext(
    \`datagrid\`,
    new TzezarDatagrid({
        data,
        columns,
    })
);`,
    columns: `import type { BaseColumn } from "$lib/datagrid/types";
import type { InventoryDataRow as Row } from "$lib/data/inventory";

export const columns = [
    {
        id: 'product.name',
        title: 'Product name',
        grow: true
    },
    {
        id: 'price',
        title: 'Price',
    },
] satisfies BaseColumn<Row>[]`,

    data: `{ 
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
}`,

    rendering: `<Datagrid.Datagrid>
	{#snippet head()}
		{#each datagrid.columns as column (column.id)}
			<Datagrid.Header {column} />
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.data as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					<Datagrid.Cell {columnIndex} {rowIndex} {column} {row} />
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>`,
fullCode: `<script lang="ts">
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
		\`datagrid\`,
		new TzezarDatagrid({
			data,
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
		{#each datagrid.data as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					<Datagrid.Cell {columnIndex} {rowIndex} {column} {row} />
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>`
}




