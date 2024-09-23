<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { getContext } from 'svelte';
	import { toggleColumnVisibility } from '../fns/toggle-column-visibility';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { TzezarDatagrid } from '../tzezar-datagrid.svelte';

	const datagrid = getContext<TzezarDatagrid>('datagrid');
</script>

<DropdownMenu.Root closeOnItemClick={false}>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} size="sm">Visibility</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			{#each datagrid.columns as column}
				<DropdownMenu.Item
					onclick={() => (datagrid.columns = toggleColumnVisibility(column.id, datagrid.columns))}
					disabled={column.hideable === false}
				>
					<div class="flex w-full flex-row justify-between gap-2">
						<p>{column.title}</p>
						<input tabindex="-1" type="checkbox" checked={column.visible} aria-disabled="true" />
					</div>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
