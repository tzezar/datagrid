<script lang="ts">
    import type { DataGrid } from '$lib/datagrid/core/index.svelte';
    import type { GridGroupRow, LeafColumn } from '$lib/datagrid/core/types';

    type Props = {
        datagrid: DataGrid<any>;
        column: LeafColumn<any>;
        row: GridGroupRow<any>;
    };

    let { datagrid, column, row }: Props = $props();
</script>

<div class="">
    <div class="text-muted-foreground text-xs">
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