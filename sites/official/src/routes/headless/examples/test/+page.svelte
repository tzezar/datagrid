<script lang="ts">
	import TestCopyDatagrid from '../_components/datagrids/test copy/test-copy-datagrid.svelte';
import TestDatagrid from '../_components/datagrids/test/test-datagrid.svelte';

	let { data } = $props();
</script>


<h2>Basic datagrid implementation</h2>
<!-- <TestDatagrid {data} /> -->
<TestCopyDatagrid {data}/>
<div class="prose w-full min-w-full">
	<!-- <Readme /> -->
</div>
