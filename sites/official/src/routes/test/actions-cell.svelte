<script lang="ts">
	import type { Datagrid } from "./datagrid/core/index.svelte";

    let { row, datagrid }: {row: any, datagrid: Datagrid<any>} = $props()

    const handleClick = () => {
        datagrid.rowExpanding.toggleRowExpansion(row.index);
    }

</script>

<button onclick={handleClick}>expand</button>