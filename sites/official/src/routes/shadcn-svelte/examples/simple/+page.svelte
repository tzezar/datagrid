<script lang="ts">
	import '$lib/datagrid/prebuilt/shadcn/styles.css';
	import { TzezarsDatagrid } from '$lib/datagrid/prebuilt/shadcn/core/index.svelte';
	import { userColumns } from './columns.svelte';
	import DatagridShadcnSvelte from '$lib/datagrid/prebuilt/shadcn/datagrid-shadcn-svelte.svelte';

	let { data } = $props();

	let datagrid = new TzezarsDatagrid({
		columns: userColumns,
		data: data.users
	});
	
</script>

<DatagridShadcnSvelte {datagrid} />
