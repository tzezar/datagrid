<script lang="ts">
	import type { AnyColumn, GroupColumn } from "$lib/datagrid/core/types";
	import {  isColumnInGroupTree } from "$lib/datagrid/core/utils.svelte";
	import MoveDown from "$lib/datagrid/icons/material-symbols/move-down.svelte";
	import MoveUp from "$lib/datagrid/icons/material-symbols/move-up.svelte";
	import type { EnhancedDatagrid } from "../../core/index.svelte";


    type Props = {
        datagrid: EnhancedDatagrid<any>;
        column: AnyColumn<any>;
    }

    let { datagrid, column }: Props = $props();
    
</script>

<div class="text-muted-foreground flex flex-row gap-2 text-xs">
    <button onclick={() => datagrid.handlers.column.moveLeft(column.columnId)}>
        <MoveUp />
    </button>
    <button onclick={() => datagrid.handlers.column.moveRight(column.columnId)}>
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
                const targetGroup = datagrid.columns.getGroupColumns()
                    .find((group: GroupColumn<any>) => group.columnId === targetGroupId);

                if (targetGroup && isColumnInGroupTree(targetGroup, column)) {
                    console.warn('Cannot move a group into its own descendant');
                    e.currentTarget.value = column.parentColumnId || '';
                    return;
                }
            }

            datagrid.handlers.column.moveColumnToPosition({
                columnId: column.columnId,
                targetGroupColumnId: targetGroupId
            });
        }}
    >
        <option value="">Root Level</option>
        {#each datagrid.columns.getGroupColumns()
            .filter((groupCol: GroupColumn<any>) => column.type !== 'group' || (groupCol !== column && !isColumnInGroupTree(groupCol, column))) as groupColumn (groupColumn.columnId)}
            <option value={groupColumn.columnId} disabled={groupColumn === column}>
                {groupColumn.header}
            </option>
        {/each}
    </select>
</div>