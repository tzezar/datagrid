<script lang="ts">
    import type { Datagrid } from './datagrid/core/index.svelte';
	import type { GridRow, GridRowIdentifier } from './datagrid/core/types';
	import { isGridGroupRow } from './datagrid/core/utils.svelte';
    
    let { row, datagrid }: { row: GridRow<any>; datagrid: Datagrid<any> } = $props();

    let getId = (row: any): GridRowIdentifier => {
        if (isGridGroupRow(row)) {
            return row.identifier;
        }
        return row.original.id
    }


</script>


<div class='flex flex-row gap-2'>
    <button onclick={() => datagrid.rowPinning.pinTop(getId(row))}>pin to top</button>
    <button onclick={() => datagrid.rowPinning.pinBottom(getId(row))}>pin to bottom</button>
</div>