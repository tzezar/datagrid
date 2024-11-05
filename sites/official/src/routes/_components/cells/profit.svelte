<script lang='ts'>
	import type { Row } from "$lib/datagrid/processors/data-processor.svelte";


    let {row}: {row: Row} = $props();

</script>

{row?.original?.profit} test