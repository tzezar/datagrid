
<script lang='ts'>
	import ColumnOrdering from "./column-ordering.svelte";
	import ColumnPinning from "./column-pinning.svelte";
	import ColumnSizing from "./column-sizing.svelte";
	import ColumnVisibility from "./column-visibility.svelte";
	import GroupBy from "./group-by.svelte";

    let { datagrid }: { datagrid: any } = $props();

</script>
<ColumnSizing {datagrid} />
<ColumnOrdering {datagrid} />
<ColumnPinning {datagrid} />
<ColumnVisibility {datagrid} />
<GroupBy {datagrid} />
