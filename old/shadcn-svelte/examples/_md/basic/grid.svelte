<script lang="ts">
	import '../styles.css';
	import type { SalesDataRow } from '$lib/generate-data/generate-sales-data';
	import { columns } from './columns';
	import { Datagrid } from '$lib/tzezars-datagrid/core/index.svelte';
	import GridComponent from '$lib/tzezars-datagrid/prebuilt/shadcn-svelte/grid.svelte';
	import * as Grid from '$lib/tzezars-datagrid/prebuilt/shadcn-svelte';
	import { setContext } from 'svelte';

	let { data }: { data: SalesDataRow[] } = $props();

	let grid = new Datagrid({
		data,
		columns
	});



	type TextSize = 'sm' | 'md' | 'lg';
	type Padding = 'sm' | 'md' | 'lg';

	type GridConfig = {
		preferences: {
			textSize: TextSize;
			textSizes: { [key in TextSize]: string };
			padding: Padding;
			paddingSizes: { [key in Padding]: string };
		},
		state: {
			fullscreen: boolean;
			columnFilters: boolean;
		}
	}

	
	let gridConfig: GridConfig = {
		preferences: {
			textSize: 'md',
			textSizes: {
				sm: '0.75rem',
				md: '1rem',
				lg: '1.25rem'
			},
			padding: 'md',
			paddingSizes: {
				sm: '0.25rem',
				md: '0.5rem',
				lg: '0.75rem'
			}
		},
		state: {
			fullscreen: false,
			columnFilters: false
		}
	};
	
	grid.config = gridConfig
	
	setContext('grid', {});


</script>

<GridComponent {grid}>
	{#snippet header()}
		<Grid.Header>
			<Grid.HeaderRow>
				{#each grid.columnManager.getVisibleColumns() as column}
					<Grid.HeaderCell {column} {grid} />
				{/each}
			</Grid.HeaderRow>
		</Grid.Header>
	{/snippet}
	{#snippet body()}
		<Grid.Body>
			{#each grid.rows as row}
				{#if row.groupId}
					<Grid.Row>
						{#each grid.columns as column}
							<Grid.GroupCell {column} {row} {grid} />
						{/each}
					</Grid.Row>
				{:else}
					<Grid.Row>
						{#each grid.columnManager.getVisibleColumns() as column}
							<Grid.Cell {column} {row} {grid} />
						{/each}
					</Grid.Row>
					{#if grid.rowManager.isRowExpanded(String(row.original.id))}
						<Grid.Row>
							<Grid.Cell {grid} {row}>some content here eg lazy loaded</Grid.Cell>
						</Grid.Row>
					{/if}
				{/if}
			{/each}
		</Grid.Body>
	{/snippet}
</GridComponent>
