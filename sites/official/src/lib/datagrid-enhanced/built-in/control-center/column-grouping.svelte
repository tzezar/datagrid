<script lang="ts">
	import type { AnyColumn, GroupColumn } from "$lib/datagrid/core/types";
	import { isInGroupTree } from "$lib/datagrid/core/utils.svelte";
	import MoveDown from "$lib/datagrid/icons/material-symbols/move-down.svelte";
	import MoveUp from "$lib/datagrid/icons/material-symbols/move-up.svelte";
	import type { TzezarsDatagrid } from "../../core/index.svelte";


    type Props = {
        datagrid: TzezarsDatagrid<any>;
        column: AnyColumn<any>;
    }

    let { datagrid, column }: Props = $props();
    
</script>

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