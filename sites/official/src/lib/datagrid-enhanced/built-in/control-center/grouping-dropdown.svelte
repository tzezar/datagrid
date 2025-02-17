<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { EnhancedDatagrid } from '../../core/index.svelte';
	import GroupingSelect from './grouping-select.svelte';

	type Props = {
		datagrid: EnhancedDatagrid<any>;
	};

	let { datagrid }: Props = $props();
</script>

<DropdownMenu.Item closeOnSelect={false} class="p-0">
	<GroupingSelect {datagrid} />
</DropdownMenu.Item>
