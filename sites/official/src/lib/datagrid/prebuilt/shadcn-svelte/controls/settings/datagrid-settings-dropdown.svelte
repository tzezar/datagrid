<script lang="ts">
	let { datagrid }: { datagrid: Datagrid<any> } = $props();

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import {
		filterOutGroupColumns,
		flattenColumns,
		getSortDirection,
		getSortIndex,
		isDescendantOf,
		onSort
	} from '$lib/datagrid/core/utils.svelte';
	import Visibility from '$lib/datagrid/icons/material-symbols/visibility.svelte';
	import VisibilityOff from '$lib/datagrid/icons/material-symbols/visibility-off.svelte';
	import Slider from '$lib/components/ui/slider/slider.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Sort from '$lib/datagrid/icons/material-symbols/sort.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { PinningPosition } from '$lib/datagrid/core/types';
	import StabilizationLock from '$lib/datagrid/icons/material-symbols/stabilization-lock.svelte';
	import Width from '$lib/datagrid/icons/material-symbols/width.svelte';
	import MoveUp from '$lib/datagrid/icons/material-symbols/move-up.svelte';
	import type { AnyColumn, GroupColumn } from '$lib/datagrid/core/helpers/column-creators';
	import { isGroupColumn } from '$lib/datagrid/core/column-guards';
	import MoveDown from '$lib/datagrid/icons/material-symbols/move-down.svelte';
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import DeleteOutline from '$lib/datagrid/icons/material-symbols/delete-outline.svelte';
	import Settings from '$lib/datagrid/icons/material-symbols/settings.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import SortDescending from '$lib/datagrid/icons/tabler/sort-descending.svelte';
	import SortAscending from '$lib/datagrid/icons/tabler/sort-ascending.svelte';
	import ArrowsSort from '$lib/datagrid/icons/tabler/arrows-sort.svelte';

	function handleColumnPinningChange(column: AnyColumn<any>, position: PinningPosition) {
		datagrid.columnManager.handlers.changeColumnPinningPosition(column.columnId, position);
	}

	const leafColumns = datagrid.columnManager.getLeafColumns()

	let sortableColumns = $derived(
		leafColumns.filter((column) => column.options.sortable === true)
	);

	let selectedColumns: Record<string, boolean> = $state({});
	let newGroupName = $state('');
</script>

{#snippet sorting()}
	<DropdownMenu.Sub>
		<DropdownMenu.SubTrigger>
			<Sort class="mr-2 size-4" />
			<span>Sorting</span>
		</DropdownMenu.SubTrigger>
		<DropdownMenu.SubContent>
			{#each sortableColumns as column}
				<DropdownMenu.Item closeOnSelect={false} onclick={(e) => onSort(datagrid, column, e)}>
					{#if column.options.sortable}
						<div class="sort-indicator">
							{#if getSortDirection(datagrid, column) === 'desc'}
								<SortDescending />
							{:else if getSortDirection(datagrid, column) === 'asc'}
								<SortAscending />
							{:else if getSortDirection(datagrid, column) === 'intermediate'}
								<ArrowsSort />
							{/if}

							{#if getSortIndex(datagrid, column)}
								<span class="text-xs">{getSortIndex(datagrid, column)}</span>
							{/if}
						</div>
					{/if}
					<span>{column.header}</span>
				</DropdownMenu.Item>
			{/each}
			<DropdownMenu.Item disabled>
				<span>Hold <Badge>Shift</Badge> to multi-sort</span>
			</DropdownMenu.Item>
		</DropdownMenu.SubContent>
	</DropdownMenu.Sub>
{/snippet}

<!-- GROUPING MENU -->

{#snippet newGroupCreationMenu()}
	<div class="column-group-menu">
		<div class="group-menu-content">
			<div class="group-menu-header">
				<Input
					type="text"
					bind:value={newGroupName}
					placeholder="Group Name"
					class="group-name-input"
				/>
			</div>

			<div class="column-list flex flex-col gap-2">
				{#each datagrid.columns as column}
					{#if !isGroupColumn(column)}
						<label class="column-item">
							<input type="checkbox" bind:checked={selectedColumns[column.columnId]} />
							{column.header}
						</label>
					{/if}
				{/each}
			</div>

			<div class="group-menu-footer">
				<Button
					class="w-full"
					disabled={!newGroupName || !Object.values(selectedColumns).some((v) => v)}
					onclick={() => {
						const columnsToGroup = Object.entries(selectedColumns)
							.filter(([_, selected]) => selected)
							.map(([columnId]) => columnId);

						datagrid.columnGrouping.createGroupColumn(columnsToGroup, newGroupName);
						selectedColumns = {};
						newGroupName = '';
					}}
				>
					Create Group
				</Button>
			</div>
		</div>
	</div>
{/snippet}

{#snippet columnGroupControls(column: AnyColumn<any>)}
	<div class="text-muted-foreground flex flex-row gap-2 text-xs">
		<button onclick={() => datagrid.columnOrdering.moveLeftWithinGroup(column)}><MoveUp /></button>
		<button onclick={() => datagrid.columnOrdering.moveColumnRight(column)}><MoveDown /></button>
		<select
			id={`group-select-${column.columnId}`}
			class="w-full"
			value={column.parentColumnId || ''}
			onchange={(e) => {
				const targetGroupId = e.currentTarget.value;
				if (targetGroupId === column.parentColumnId) return;

				if (column.type === 'group') {
					const targetGroup = datagrid.columnManager
						.getGroupColumns()
						.find((group: GroupColumn<any>) => group.columnId === targetGroupId);

					if (targetGroup && isDescendantOf(targetGroup, column)) {
						console.warn('Cannot move a group into its own descendant');
						e.currentTarget.value = column.parentColumnId || '';
						return;
					}
				}

				datagrid.columnOrdering.moveColumnToGroup(column, targetGroupId);
			}}
		>
			<option value="">Root Level</option>
			{#each datagrid.columnManager
				.getGroupColumns()
				.filter((groupCol: GroupColumn<any>) => column.type !== 'group' || (groupCol !== column && !isDescendantOf(groupCol, column))) as groupColumn}
				<option value={groupColumn.columnId} disabled={groupColumn === column}>
					{groupColumn.header}
				</option>
			{/each}
		</select>
	</div>
{/snippet}

{#snippet ordering(columns: AnyColumn<any>[])}
	{#each columns as column (column.columnId)}
		{#if isGroupColumn(column)}
			<div class="m-2 border p-2 text-sm font-bold">
				<div class="flex items-center justify-between">
					{column.header}
					<button onclick={() => datagrid.columnGrouping.deleteGroupColumn(column)}
						><DeleteOutline /></button
					>
				</div>
				{@render columnGroupControls(column)}
				{@render ordering(column.columns)}
			</div>
		{:else}
			<div class="m-2 border p-2">
				<span class="text-xs font-bold">{column.header}</span>
				{@render columnGroupControls(column)}
			</div>
		{/if}
	{/each}
{/snippet}

{#snippet reordering()}
	<DropdownMenu.Sub>
		<DropdownMenu.SubTrigger>
			<MoveUp class="mr-2 size-4" />
			<span>Reordering</span>
		</DropdownMenu.SubTrigger>
		<DropdownMenu.SubContent class="max-h-[400px] overflow-auto">
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>
					<MoveUp class="mr-2 size-4" />
					<span>Create Group</span>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent>
					{@render newGroupCreationMenu()}
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Separator />
			{@render ordering(datagrid.columns)}
		</DropdownMenu.SubContent>
	</DropdownMenu.Sub>
{/snippet}

{#snippet freezing()}
	<DropdownMenu.Sub>
		<DropdownMenu.SubTrigger>
			<StabilizationLock class="mr-2 size-4" />
			<span>Freezing</span>
		</DropdownMenu.SubTrigger>
		<DropdownMenu.SubContent>
			{#each leafColumns as column}
				<DropdownMenu.Item closeOnSelect={false} class="flex flex-row flex-nowrap gap-2">
					<span>{column.header}</span>
					<Select.Root
						type="single"
						name="pinningPosition"
						value={column.state.pinning.position}
						disabled={column.options.pinnable === false}
						onValueChange={(value: string) =>
							handleColumnPinningChange(column, value as PinningPosition)}
					>
						<Select.Trigger class="ml-auto w-[180px]" disabled={column.options.pinnable === false}>
							{column.state.pinning.position}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Item value={'none'}>none</Select.Item>
								<Select.Item value={'left'}>left</Select.Item>
								<Select.Item value={'right'}>right</Select.Item>
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.SubContent>
	</DropdownMenu.Sub>
{/snippet}

{#snippet resizing()}
	<DropdownMenu.Sub>
		<DropdownMenu.SubTrigger>
			<Width class="mr-2 size-4" />
			<span>Resizing</span>
		</DropdownMenu.SubTrigger>
		<DropdownMenu.SubContent>
			{#each leafColumns as column}
				<DropdownMenu.Item closeOnSelect={false} class="flex flex-col">
					<span>{column.header}</span>
					<Slider
						class="ml-auto"
						type="single"
						min={column.state.size.minWidth}
						max={column.state.size.maxWidth}
						value={column.state.size.width}
						onValueChange={(value: number) => {
							datagrid.columnSizing.setColumnSize(column.columnId, Number(value));
							datagrid.processors.column.refreshColumnPinningOffsets();
						}}
					/>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.SubContent>
	</DropdownMenu.Sub>
{/snippet}

{#snippet visibility()}
	<DropdownMenu.Sub>
		<DropdownMenu.SubTrigger closeOnSelect={false}>
			<Visibility class="mr-2 size-4" />
			<span>Visibility</span>
		</DropdownMenu.SubTrigger>
		<DropdownMenu.SubContent>
			{#each sortableColumns as column}
				<DropdownMenu.Item
					disabled={column.options.hideable === false}
					class={`${column.state.visible === true ? 'text-primary' : 'text-muted-foreground'}`}
					closeOnSelect={false}
					onclick={() => datagrid.columnVisibility.toggleColumnVisibility(column.columnId)}
				>
					<span>
						{column.header}
					</span>
					<span class="ml-auto">
						{#if column.state.visible === true}
							<Visibility class="mr-2 size-4" />
						{:else}
							<VisibilityOff class="mr-2 size-4" />
						{/if}
					</span>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.SubContent>
	</DropdownMenu.Sub>
{/snippet}

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={`${buttonVariants({ variant: 'outline' })} rounded-none`}>
		<Settings />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Column options</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				{@render sorting()}
				{@render reordering()}
				{@render freezing()}
				{@render resizing()}
				{@render visibility()}
			</DropdownMenu.Group>
			<!-- <DropdownMenu.Separator /> -->
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
