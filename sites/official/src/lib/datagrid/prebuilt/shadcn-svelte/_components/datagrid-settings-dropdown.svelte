<script lang="ts">
	let { datagrid }: { datagrid: DataGrid<any> } = $props();

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { getSortDirection, getSortIndex, isDescendantOf } from '$lib/datagrid/core/utils.svelte';
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

	import type { AnyColumn, GroupColumn } from '$lib/datagrid/core/column-creation/types';
	import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';
	import MoveDown from '$lib/datagrid/icons/material-symbols/move-down.svelte';
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';
	import DeleteOutline from '$lib/datagrid/icons/material-symbols/delete-outline.svelte';
	import Settings from '$lib/datagrid/icons/material-symbols/settings.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import SortDescending from '$lib/datagrid/icons/tabler/sort-descending.svelte';
	import SortAscending from '$lib/datagrid/icons/tabler/sort-ascending.svelte';
	import ArrowsSort from '$lib/datagrid/icons/tabler/arrows-sort.svelte';
	import AdGroupOutlineSharp from '$lib/datagrid/icons/material-symbols/ad-group-outline-sharp.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import GroupRowsByColumnDropdown from './group-rows-by-column-dropdown.svelte';

	
	function handleColumnPinningChange(column: AnyColumn<any>, position: PinningPosition) {
		datagrid.eventHandlers.columnPinning.changeColumnPinningPosition(column.columnId, position);
	}

	const leafColumns = datagrid.columnManager.getLeafColumns();

	let sortableColumns = $derived(leafColumns.filter((column) => column.options.sortable === true));

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
				<DropdownMenu.Item
					closeOnSelect={false}
					onclick={(e) => datagrid.eventHandlers.sorting.toggleColumnSorting(column, e)}
				>
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
	<div class="flex flex-col gap-2 p-2">
		<div class="">
			<Input
				type="text"
				bind:value={newGroupName}
				placeholder="Group Name"
				class="group-name-input"
			/>
		</div>

		<div class=" flex flex-col gap-2">
			{#each datagrid.columns as column}
				{#if !isGroupColumn(column)}
					<div class='flex flex-row gap-2 items-center'>
						<Checkbox
						id={column.columnId}
						checked={selectedColumns[column.columnId]}
						onCheckedChange={(checked) => (selectedColumns[column.columnId] = checked)}
					/>
					<label for={column.columnId} >
						{column.header}
					</label>
					</div>
				{/if}
			{/each}
		</div>

		<div class="group-menu-footer">
			<Button
				class="w-full"
				disabled={!newGroupName || !Object.values(selectedColumns).some((v) => v)}
				onclick={() => {
					datagrid.eventHandlers.columnGrouping.createGroup({
						newGroupName,
						selectedColumns
					});

					selectedColumns = {};
					newGroupName = '';
				}}
			>
				Create Group
			</Button>
		</div>
	</div>
{/snippet}

{#snippet columnGroupControls(column: AnyColumn<any>)}
	<div class="text-muted-foreground flex flex-row gap-2 text-xs">
		<button onclick={() => datagrid.eventHandlers.columnOrdering.moveLeft(column.columnId)}>
			<MoveUp />
		</button>
		<button onclick={() => datagrid.eventHandlers.columnOrdering.moveRight(column.columnId)}>
			<MoveDown />
		</button>
		<select
			id={`group-select-${column.columnId}`}
			class="w-full min-w-[100px]"
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

				datagrid.eventHandlers.columnOrdering.moveColumnToGroup({
					columnId: column.columnId,
					targetGroupColumnId: targetGroupId
				});
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

{#snippet ordering(columns: AnyColumn<any>[], depth: number = 0)}
	<div class="flex flex-col gap-4">
		{#each columns as column (column.columnId)}
			{#if isGroupColumn(column)}
				<div class="flex gap-4 rounded-md border p-4">
					<div class="flex flex-col gap-2">
						<div class="flex w-full flex-row justify-between gap-4">
							<span class="text-xs font-bold">{column.header}</span>
							<button onclick={() => datagrid.columnGrouping.deleteGroupColumn(column)}>
								<DeleteOutline />
							</button>
						</div>
						{@render columnGroupControls(column)}
					</div>
					{@render ordering(column.columns, depth + 1)}
				</div>
			{:else}
				<div class="flex flex-col gap-2 rounded-md border p-4">
					<span class="text-xs font-bold">{column.header}</span>
					{@render columnGroupControls(column)}
				</div>
			{/if}
		{/each}
	</div>
{/snippet}

{#snippet reordering()}
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
					{@render ordering(datagrid.columns)}
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Root>
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
							datagrid.columnSizing.updateColumnSize(column.columnId, Number(value));
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

{#snippet groupBy()}
	<DropdownMenu.Item closeOnSelect={false}>
		<!-- <GroupBy class="mr-2 size-4" /> -->
		<GroupRowsByColumnDropdown {datagrid} />
	</DropdownMenu.Item>
{/snippet}

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={`${buttonVariants({ variant: 'outline' })} rounded-none border-b-0`}>
		<Settings />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Datagrid control center</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				{@render sorting()}
				{@render reordering()}
				{@render freezing()}
				{@render resizing()}
				{@render visibility()}
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<AdGroupOutlineSharp class="mr-2 size-4" />
						<span>Create Group</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						{@render newGroupCreationMenu()}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				{@render groupBy()}
			</DropdownMenu.Group>
			<!-- <DropdownMenu.Separator /> -->
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
