<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { getContext } from 'svelte';
	import { cn } from '$lib/utils';
	import { updateColumnWidth } from '../fns/update-column-width';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { TzezarDatagrid } from '../tzezar-datagrid.svelte';

	const datagrid = getContext<TzezarDatagrid>('datagrid');
</script>

<DropdownMenu.Root closeOnItemClick={false}>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} size="sm">Resizing</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="">
		<DropdownMenu.Group>
			{#each datagrid.columns as column}
				<DropdownMenu.Item>
					<div>
						<p class={cn('', column.resizable === false ? 'text-muted-foreground' : '')}>
							{column.title}
						</p>
						<input
							disabled={column.resizable === false}
							type="range"
							value={parseInt(column.width || '0', 10)}
							oninput={(e) =>
								(datagrid.columns = updateColumnWidth(
									e.currentTarget.value,
									column.id,
									datagrid.columns
								))}
							min={100}
							max={500}
							step={50}
						/>
					</div>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
