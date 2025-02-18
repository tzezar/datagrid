<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	import { cn } from '$lib/utils';
	import { getContext } from 'svelte';
	import { moveColumn } from '../fns/move-column';
	import type { TzezarDatagrid } from '../tzezar-datagrid.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	const datagrid = getContext<TzezarDatagrid>('datagrid');
</script>

<DropdownMenu.Root closeOnItemClick={false}>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} size="sm">Reordering</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			{#each datagrid.columns as column, index}
				<DropdownMenu.Item disabled={column.moveable === false}>
					<div class={cn('flex w-full justify-between gap-4')}>
						<span class="">{column.title}</span>
						<div class="">
							<Button
								class="h-8 w-8"
								onclick={() => moveColumn(index, -1, datagrid.columns)}
								disabled={column.moveable === false || index === 0}
							>
								^
							</Button>
							<Button
								class="h-8 w-8"
								onclick={() => moveColumn(index, 1, datagrid.columns)}
								disabled={column.moveable === false || index === datagrid.columns.length - 1}
							>
								v
							</Button>
						</div>
					</div>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
