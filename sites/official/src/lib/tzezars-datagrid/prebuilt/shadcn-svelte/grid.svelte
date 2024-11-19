<script lang="ts">
	import * as Grid from '$lib/tzezars-datagrid/prebuilt/shadcn-svelte';
	import type { Datagrid } from '$lib/tzezars-datagrid/core/index.svelte';
	import { type Row } from '$lib/tzezars-datagrid/core/processors/data-processor.svelte';
	import type { Snippet } from 'svelte';
	import { VirtualList } from 'svelte-virtuallists';
	import Toolbar from './_components/toolbar.svelte';

	type Config = {
		pagination?: boolean;
		virtualization?: boolean;
	};

	let {
		grid,
		header,
		body,
		pagination,
		config = {
			pagination: true,
			virtualization: false
		}
	}: {
		grid: Datagrid<any, any>;
		header?: Snippet;
		body?: Snippet;
		pagination?: Snippet;
		config?: Config;
	} = $props();
</script>

<Grid.Wrapper>
	<Grid.Toolbar {grid}/>
	<Grid.Content>
		{#if config.virtualization === true}
			<VirtualList items={grid.rows}  isTable={true}>
				{#snippet header()}
					<!-- ? It has to be a div or other html element, not a svelte component. Does not work with svelte component for some reason. -->
					<div class="grid-header-row">
						{#each grid.columnManager.getVisibleColumns() as column}
							<Grid.HeaderCell {column} {grid} />
						{/each}
					</div>
				{/snippet}
				{#snippet vl_slot({ item: row, index }: { item: Row<any>; index: number })}
					{#if row.groupId}
						<Grid.Row>
							{#each grid.columns as column, colIndex}
								<Grid.Cell {grid} {column} {row}>
									{#if column.columnId === row.columnId}
										<span class="overflow-hidden text-ellipsis font-bold">{row.groupId}</span>
									{:else if row.aggregates[column.columnId]}
										{#each Object.entries(row.aggregates[column.columnId]) as [aggKey, aggValue]}
											<span class="text-muted-foreground text-xs">
												{aggKey}: {aggValue.toFixed(2)}
											</span>
										{/each}
									{/if}
								</Grid.Cell>
							{/each}
						</Grid.Row>
					{:else}
						<Grid.Row>
							{#each grid.columnManager.getVisibleColumns() as column}
								<Grid.Cell {column} {grid} {row} />
							{/each}
						</Grid.Row>
						{#if grid.rowManager.isRowExpanded(String(row?.original?.id))}
							<Grid.Row>
								<div class="grid-cell">
									Penguins propose to their mates by giving them a pebble. 💍🐧
								</div>
							</Grid.Row>
						{/if}
					{/if}
				{/snippet}
			</VirtualList>
		{:else}
			{#if header}
				{@render header()}
			{:else}
				<Grid.Header>
					<Grid.HeaderRow>
						{#each grid.columnManager.getVisibleColumns() as column}
							<Grid.HeaderCell {column} {grid} />
						{/each}
					</Grid.HeaderRow>
				</Grid.Header>
			{/if}
			{#if body}
				{@render body()}
			{:else}
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
			{/if}
		{/if}
	</Grid.Content>
	{#if config?.pagination}
		{#if pagination}
			{@render pagination()}
		{:else}
			<Grid.Pagination {grid} />
		{/if}
	{/if}
</Grid.Wrapper>
