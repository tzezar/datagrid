<script lang="ts">
    import type { Datagrid } from './datagrid/core/index.svelte';
	import type { GridRow, RowIdentifier } from './datagrid/core/types';
	import { isGridGroupRow } from './datagrid/core/utils.svelte';
    
    let { row, datagrid }: { row: GridRow<any>; datagrid: Datagrid<any> } = $props();

    let getId = (row: any): RowIdentifier => {
        if (isGridGroupRow(row)) {
            return row.groupId;
        }
        return row.original.id
    }


</script>


<div class='flex flex-row gap-2'>
    <button onclick={() => datagrid.rowPinning.pinToTop(getId(row))}>pin to top</button>
    <button onclick={() => datagrid.rowPinning.pinToBottom(getId(row))}>pin to bottom</button>
</div>