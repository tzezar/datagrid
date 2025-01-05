<script lang="ts">
    import type { Datagrid } from '../../../../lib/datagrid/core/index.svelte';
    import type { GridGroupRow } from '../../../../lib/datagrid/core/types';
    let { datagrid, column, row }: { datagrid: Datagrid<any>; column: any; row: GridGroupRow<any> } = $props();
</script>

<div
class="grid-body-cell group-cell"
style:--width={column.state.size.width + 'px'}
style:--min-width={column.state.size.minWidth + 'px'}
style:--max-width={column.state.size.maxWidth + 'px'}
>
{#if column._meta?.showInGroupRow}
    {#if column.cell && typeof column.cell === 'function'}
        {@const cellContent = column.cell(row)}
        {#if cellContent && typeof cellContent === 'object' && 'component' in cellContent}
            <!-- svelte-ignore svelte_component_deprecated -->
            <svelte:component this={cellContent.component} {...cellContent.props} {datagrid} />
        {/if}
    {/if}
{/if}
{#if column.columnId === row.groupKey}
    <div class="group-cell-content">
        <button
            class="group-expand-inline-toggle"
            onclick={() => datagrid.rowManager.toggleGroupRowExpansion(row)}
        >
            <span class="expand-icon">
                {datagrid.rowManager.isGroupRowExpanded(row) ? '▼' : '▶'}
            </span>
            <span class="group-value">
                {row.groupValue[0]}
            </span>
        </button>
        <span class="group-items-count">
            ({row.children.length} items)
        </span>
    </div>
{:else if row.aggregations.some((agg) => agg.columnId === column.columnId)}
    <div class="group-cell-content">
        <div class="group-cell-content-value">
            {#each row.aggregations.filter((agg) => agg.columnId === column.columnId) as aggregation}
                <p>
                    {aggregation.type}: {#if aggregation.type === 'percentChange'}
                        {aggregation.value.toFixed(2)}%
                    {:else if typeof aggregation.value === 'number'}
                        {aggregation.value.toLocaleString()}
                    {:else}
                        {aggregation.value}
                    {/if}
                </p>
            {/each}
        </div>
    </div>
{/if}
</div>