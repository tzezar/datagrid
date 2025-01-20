<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import MoveUp from '$lib/datagrid/icons/material-symbols/move-up.svelte';
	import type { TzezarsDatagrid } from '../../core/index.svelte';
	import Ordering from './ordering.svelte';

	type Props = {
		datagrid: TzezarsDatagrid<any>;
	};

	let { datagrid }: Props = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-full">
		<DropdownMenu.Item closeOnSelect={false}>
			<MoveUp class="mr-2 size-4" />
			<span>Reordering</span>
		</DropdownMenu.Item>
	</Dialog.Trigger>
	<Dialog.Content class="h-full max-h-[80vh] max-w-4xl overflow-auto">
		<div class="h-full w-full overflow-auto">
			<div style="" class="inline-block">
				<Ordering {datagrid} columns={datagrid.columns} depth={0} />
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
