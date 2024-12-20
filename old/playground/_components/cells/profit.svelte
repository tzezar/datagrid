<script lang='ts'>
	import type { Row } from "$lib/tzezars-datagrid/processors/data-processor.svelte";


    let {row}: {row: Row} = $props();

</script>

{row?.original?.profit} custom cell