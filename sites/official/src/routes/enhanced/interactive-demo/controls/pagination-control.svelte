<script lang="ts">
	import type { EnhancedDatagrid } from '$lib/datagrid-enhanced/core/index.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { PaginationPosition } from '$lib/datagrid/plugins/pagination.svelte';
	type Props = {
		datagrid: EnhancedDatagrid<any>;
	};

	let { datagrid }: Props = $props();
</script>

<div>
	<p>Pagination position</p>
	<div>
		<Select.Root
			type="single"
			value={datagrid.extra.features.pagination.position}
			onValueChange={(value) => {
				datagrid.extra.features.pagination.changePosition(value as PaginationPosition);
			}}
		>
			<Select.Trigger class="">
				{datagrid.extra.features.pagination.position.toLocaleUpperCase()}</Select.Trigger
			>
			<Select.Content>
				<Select.Item value="top">Top</Select.Item>
				<Select.Item value="bottom">Bottom</Select.Item>
				<Select.Item value="both">Both</Select.Item>
				<Select.Item value="none">None</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>
</div>
