
<script lang="ts">
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import { isDescendantOf } from '$lib/datagrid/core/utils.svelte';
	import { isGroupColumn } from '$lib/datagrid/core/column-guards';
	import type { AnyColumn } from '$lib/datagrid/core/helpers/column-creators';

	let { datagrid }: { datagrid: Datagrid<any> } = $props();
</script>

{#snippet ColumnGroupControls(column: AnyColumn<any>)}
	<div class="text-muted-foreground flex flex-row gap-2 text-xs">
		<button onclick={() => datagrid.columnOrdering.moveLeftWithinGroup(column)}>UP</button>
		<button onclick={() => datagrid.columnOrdering.moveColumnRight(column)}>DOWN</button>
		<select
			class="w-full"
			value={column.parentColumnId || ''}
			onchange={(e) => {
				const targetGroupId = e.currentTarget.value;
				if (targetGroupId === column.parentColumnId) return;

				if (column.type === 'group') {
					const targetGroup = datagrid.columnManager
						.getGroupColumns()
						.find((group) => group.columnId === targetGroupId);

					if (targetGroup && isDescendantOf(targetGroup, column)) {
						console.warn('Cannot move a group into its own descendant');
						e.currentTarget.value = column.parentColumnId || '';
						return;
					}
				}

				datagrid.columnOrdering.moveColumnToGroup(column, targetGroupId);
			}}
		>
			<option value="">Root Level</option>
			{#each datagrid.columnManager
				.getGroupColumns()
				.filter((groupCol) => column.type !== 'group' || (groupCol !== column && !isDescendantOf(groupCol, column))) as groupColumn}
				<option value={groupColumn.columnId} disabled={groupColumn === column}>
					{groupColumn.header}
				</option>
			{/each}
		</select>
	</div>
{/snippet}

{#snippet Ordering(columns: AnyColumn<any>[])}
	{#each columns as column (column.columnId)}
		{#if isGroupColumn(column)}
			<div class="border p-2">
				<div class="font-bold underline">
					{column.header}
					<button onclick={() => datagrid.columnGrouping.deleteGroupColumn(column)}>X</button>
				</div>
				{@render ColumnGroupControls(column)}
				{@render Ordering(column.columns)}
			</div>
		{:else}
			<div>
				<div>{column.header}</div>
				{@render ColumnGroupControls(column)}
			</div>
		{/if}
	{/each}
{/snippet}


<div class="flex flex-col gap-2">
	{@render Ordering(datagrid.columns)}
</div>