<script lang="ts">
    import type { AggregateCellProps } from '$lib/datagrid/core/types';
    let { datagrid, column, row }: AggregateCellProps<any> = $props();
</script>

<div class="">
    <div class="text-muted-foreground text-xs">
        <!-- {#each row.aggregations.filter((agg) => agg.columnId === column.columnId) as aggregation} -->
        <!-- {/each} -->
        Custom aggregation
    </div>
</div>