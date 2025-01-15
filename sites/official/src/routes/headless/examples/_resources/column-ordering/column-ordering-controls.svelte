<script lang="ts">
	import type { AnyColumn, GroupColumn } from '$lib/datagrid/core/types';
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';
	import { isInGroupTree } from '$lib/datagrid/core/utils.svelte';
	import DeleteOutline from '$lib/datagrid/icons/material-symbols/delete-outline.svelte';
	import MoveDown from '$lib/datagrid/icons/material-symbols/move-down.svelte';
	import MoveUp from '$lib/datagrid/icons/material-symbols/move-up.svelte';

	type Props = {
		datagrid: DataGrid<any>;
	};
	let { datagrid }: Props = $props();
</script>

{#snippet GroupControlsSnippet(column: AnyColumn<any>)}
	<div class="text-muted-foreground flex flex-row gap-2 text-xs">
		<button onclick={() => datagrid.handlers.columnOrdering.moveLeft(column.columnId)}>
			<MoveUp />
		</button>
		<button onclick={() => datagrid.handlers.columnOrdering.moveRight(column.columnId)}>
			<MoveDown />
		</button>
		<select
			id={`group-select-${column.columnId}`}
			class="w-full min-w-[100px]"
			value={column.parentColumnId || ''}
			onchange={(e) => {
				const targetGroupId = e.currentTarget.value;
				if (targetGroupId === column.parentColumnId) return;

				if (column.type === 'group') {
					const targetGroup = datagrid.columnManager
						.getGroupColumns()
						.find((group: GroupColumn<any>) => group.columnId === targetGroupId);

					if (targetGroup && isInGroupTree(targetGroup, column)) {
						console.warn('Cannot move a group into its own descendant');
						e.currentTarget.value = column.parentColumnId || '';
						return;
					}
				}

				datagrid.handlers.columnOrdering.moveColumnToPosition({
					columnId: column.columnId,
					targetGroupColumnId: targetGroupId
				});
			}}
		>
			<option value="">Root Level</option>
			{#each datagrid.columnManager
				.getGroupColumns()
				.filter((groupCol: GroupColumn<any>) => column.type !== 'group' || (groupCol !== column && !isInGroupTree(groupCol, column))) as groupColumn (groupColumn.columnId)}
				<option value={groupColumn.columnId} disabled={groupColumn === column}>
					{groupColumn.header}
				</option>
			{/each}
		</select>
	</div>
{/snippet}

{#snippet LevelControls(columns: AnyColumn<any>[], depth: number = 0)}
	<div class="flex flex-col gap-4">
		{#each columns as column (column.columnId)}
			{#if column.type === 'group'}
				<div class="flex gap-4 rounded-md border p-4">
					<div class="flex flex-col gap-2">
						<div class="flex w-full flex-row justify-between gap-4">
							<span class="text-xs font-bold">{column.header}</span>
							<button onclick={() => datagrid.handlers.columnGrouping.deleteGroupColumn(column)}>
								<DeleteOutline />
							</button>
						</div>
						{@render GroupControlsSnippet(column)}
					</div>
					{@render LevelControls(column.columns, depth + 1)}
				</div>
			{:else}
				<div class="flex flex-col gap-2 rounded-md border p-4">
					<span class="text-xs font-bold">{column.header}</span>
					{@render GroupControlsSnippet(column)}
				</div>
			{/if}
		{/each}
	</div>
{/snippet}



<div>
    {@render LevelControls(datagrid.columns)}

</div>

