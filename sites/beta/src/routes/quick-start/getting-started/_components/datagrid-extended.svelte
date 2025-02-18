<script lang="ts">
	import type { BaseColumn } from '$lib/datagrid/types';
	import type { InventoryDataRow as Row } from '$lib/data/inventory';
	import { setContext } from 'svelte';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import * as Datagrid from '$lib/datagrid';
	import { cn } from '$lib/utils';
	import { getNestedValue } from '$lib/datagrid/fns/get-nested-value';

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
			columns,
			options: {
                topbar: {
                    display: true,
                    displayFullscreenToggle: true,
                    displayExportDataMenu: true,
                    displayCopyDataMenu: true,
                    settingsMenu: {
                        display: true,
                    }
                }
            }
		})
	);
</script>

<Datagrid.Datagrid>
	{#snippet head()}
		{#each datagrid.columns as column (column.id)}
			{#if column.id === 'product.name'}
				<Datagrid.Header {column} class={{ title: 'text-orange-500 ' }} />
			{:else}
				<Datagrid.Header {column} />
			{/if}
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.state.processedData as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					{@const props = { columnIndex, rowIndex, column, row }}
					{@const value = getNestedValue(row, column.id)}
					{@const price = getNestedValue(row, 'price')}
					{#if column.id === 'product.name'}
						<Datagrid.Cell
							{...props}
							class={{
								cell: cn(price < 200 && 'border-r-red-500', price > 900 && 'border-r-green-500'),
								data: cn(
									price > 900 && 'font-bold',
									price < 200 && 'text-muted-foreground/50 line-through'
								)
							}}
						/>
					{:else}
						<Datagrid.Cell
							{...props}
							class={{
								cell: cn(value < 200 && ' text-red-500', value > 900 && ' text-green-500')
							}}
						/>
					{/if}
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
