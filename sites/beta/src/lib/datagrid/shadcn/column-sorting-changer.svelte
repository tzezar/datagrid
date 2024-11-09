<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { getContext } from 'svelte';
	import { toggleSortingState } from '../fns/toggle-sorting-state';
	import { getSortingPosition } from '../fns/get-sorting-position';
	import type { TzezarDatagrid } from '../tzezar-datagrid.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	const datagrid = getContext<TzezarDatagrid>('datagrid');
</script>

<DropdownMenu.Root closeOnItemClick={false}>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} size="sm">Sorting</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			{#each datagrid.columns as column}
				<DropdownMenu.Item
					disabled={column.sortable === false}
					onclick={() => {
						if (column.sortable) {
							toggleSortingState(column.id, datagrid);
						}
					}}
				>
					<div class=" flex w-full flex-row justify-between gap-4">
						<div class="flex gap-1">
							<span class="min-w-40">{column.title}</span>
						</div>
						<div class="flex items-center gap-4">
							{#if getSortingPosition(column.id, datagrid) !== null}
								<span class="text-sm text-gray-500">
									#{getSortingPosition(column.id, datagrid)}
								</span>
							{/if}
							{#if column.sortable === true}
								{#if datagrid.state.sortingArray.find((s) => s.field === column.id)?.direction === 'asc'}
									<span class="">▲</span>
								{:else if datagrid.state.sortingArray.find((s) => s.field === column.id)?.direction === 'desc'}
									<span class="">▼</span>
								{/if}
							{/if}
							{#if !column.sortable}
								disabled
							{/if}
						</div>
					</div>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
