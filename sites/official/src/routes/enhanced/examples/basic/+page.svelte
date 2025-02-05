<script lang="ts">
	import * as Grid from '$lib/datagrid-enhanced';
	import { columns } from './columns';

	let { data } = $props();

	let datagrid = new Grid.EnhancedCore({
		columns,
		data: data.inventory
	});
</script>

<Grid.Component {datagrid}></Grid.Component>
