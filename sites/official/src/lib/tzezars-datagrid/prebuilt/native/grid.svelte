<script lang="ts">
	import * as Grid from '$lib/tzezars-datagrid/components/shadcn-svelte';
	import type { Datagrid } from '$lib/tzezars-datagrid/index.svelte';

	let { grid }: { grid: Datagrid<any, any> } = $props();
</script>

<Grid.Wrapper>
	<Grid.Content>
		<Grid.Header>
			<Grid.HeaderRow>
				{#each grid.columnManager.getVisibleColumns() as column}
					<Grid.HeaderCell {column} {grid} />
				{/each}
			</Grid.HeaderRow>
		</Grid.Header>
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
					{#if grid.rowManager.isRowExpanded(String(row?.original?.id))}
						<Grid.Row>
							<div class="grid-cell">some content here eg lazy loaded</div>
						</Grid.Row>
					{/if}
				{/if}
			{/each}
		</Grid.Body>
	</Grid.Content>
	<Grid.Pagination {grid}/>
</Grid.Wrapper>
