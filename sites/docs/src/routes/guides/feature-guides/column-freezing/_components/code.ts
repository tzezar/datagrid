export const code = {
    baseColumns: `export type BaseColumn<T = unknown> = {
    pinnable?: boolean;
    pinned?: {
        position: 'left' | 'right';
        offset?: string | null;
    };
};`,
    simpleColumn: `{
    id: 'barcode',
    title: 'Barcode',
    pinned: {
        position: 'left'
    }
}`,
    columns: `import type { BaseColumn } from "$lib/datagrid/types";
import type { InventoryDataRow } from "$lib/data/inventory";

export const columns = [
    {
        id: 'barcode',
        title: 'Barcode',
        width: '200px',
        pinned: {
            position: 'left'
        },
    },

    {
        id: 'location',
        title: 'Location',
        width: '1500px',
    },

] satisfies BaseColumn<InventoryDataRow>[]`,

    important1: `satisfies BaseColumn<InventoryDataRow>[]`,
    datagrid: `<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';

	let datagrid = setContext(
		\`datagrid\`,
		new TzezarDatagrid({
			title: 'Column freezing',
			data,
			columns,
			options: {...}
		})
	);
</script>

<Datagrid.Datagrid>
	{#snippet topBar()}
		<Datagrid.TopBar />
	{/snippet}
	{#snippet head()}
		{#each datagrid.columns as column, i (column.id)}
			<Datagrid.Header {column}>
				{#snippet filter()}
					<Datagrid.ColumnFilter {column} />
				{/snippet}
			</Datagrid.Header>
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.internal.paginatedData as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					<Datagrid.Cell {column} {row} {columnIndex} {rowIndex}></Datagrid.Cell>
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
`
}
