<script lang='ts'>
	import { generateData } from "$lib/data-generators/generate-data";
	import { generateUser } from "$lib/data-generators/generate/user";
	import { TzezarsDatagrid } from "$lib/datagrid/prebuilt/shadcn-svelte/core/index.svelte";
	import Datagrid from "$lib/datagrid/prebuilt/shadcn-svelte/datagrid-component/datagrid.svelte";
	import { userColumns } from "./columns.svelte";

    let data = generateData(generateUser, 100);

    let datagrid = new TzezarsDatagrid({
        columns: userColumns,
        data: data
    });

</script>

<Datagrid {datagrid} />
