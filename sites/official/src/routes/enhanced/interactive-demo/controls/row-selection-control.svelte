<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { EnhancedDatagrid } from '$lib/datagrid-enhanced/core/index.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { AutoColumnPosition } from '$lib/datagrid-enhanced/core/types';

	type Props = {
		datagrid: EnhancedDatagrid<any>;
	};

	let { datagrid }: Props = $props();
</script>

<div>
	<p>Column sorting</p>
	<div>
		<Select.Root
			type="single"
			value={datagrid.extra.features.rowSelection.position}
			onValueChange={(value) => {
				datagrid.extra.features.rowSelection.changePosition(value as AutoColumnPosition);
			}}
		>
			<Select.Trigger class="">
				{datagrid.extra.features.rowSelection.position.toLocaleUpperCase()}
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="left">Left</Select.Item>
				<Select.Item value="right">Right</Select.Item>
				<Select.Item value="none">None</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>
</div>
