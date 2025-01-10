<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import MoreVert from '$lib/datagrid/icons/material-symbols/more-vert.svelte';
	import { cn } from '$lib/utils';
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';
	import SortAscending from '$lib/datagrid/icons/tabler/sort-ascending.svelte';
	import SortDescending from '$lib/datagrid/icons/tabler/sort-descending.svelte';
	import ArrowsSort from '$lib/datagrid/icons/tabler/arrows-sort.svelte';
	import FilterX from '$lib/datagrid/icons/tabler/filter-x.svelte';
	import FilterCog from '$lib/datagrid/icons/tabler/filter-cog.svelte';
	import AdGroupOutlineSharp from '$lib/datagrid/icons/material-symbols/ad-group-outline-sharp.svelte';
	import AdGroupOffOutlineSharp from '$lib/datagrid/icons/material-symbols/ad-group-off-outline-sharp.svelte';
	import FreezeColumn from '$lib/datagrid/icons/tabler/freeze-column.svelte';
	import ColumnsOff from '$lib/datagrid/icons/tabler/columns-off.svelte';
	import VisibilityOff from '$lib/datagrid/icons/material-symbols/visibility-off.svelte';
	import ArrowMoveLeft from '$lib/datagrid/icons/tabler/arrow-move-left.svelte';
	import ArrowMoveRight from '$lib/datagrid/icons/tabler/arrow-move-right.svelte';
	import MoveUp from '$lib/datagrid/icons/material-symbols/move-up.svelte';
	import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';
	import type { AnyColumn } from '$lib/datagrid/core/column-creation/types';
	import { selectFilterOperators, stringFilterOperators } from '$lib/datagrid/core/constants';
	import { numberFilterOperators } from '$lib/datagrid/core/constants';
	import Equals from '$lib/datagrid/icons/filter-operators/equals.svelte';
	import NotEquals from '$lib/datagrid/icons/filter-operators/not-equals.svelte';
	import GreaterThan from '$lib/datagrid/icons/filter-operators/greater-than.svelte';
	import LessThan from '$lib/datagrid/icons/filter-operators/less-than.svelte';
	import GreateThanOrEqualTo from '$lib/datagrid/icons/filter-operators/greate-than-or-equal-to.svelte';
	import LessThanOrEqualTo from '$lib/datagrid/icons/filter-operators/less-than-or-equal-to.svelte';
	import Between from '$lib/datagrid/icons/filter-operators/between.svelte';
	import Empty from '$lib/datagrid/icons/filter-operators/empty.svelte';
	import NotEmpty from '$lib/datagrid/icons/filter-operators/not-empty.svelte';
	import Contains from '$lib/datagrid/icons/filter-operators/contains.svelte';
	import EndsWith from '$lib/datagrid/icons/filter-operators/ends-with.svelte';
	import StartsWith from '$lib/datagrid/icons/filter-operators/starts-with.svelte';

	type NumberFilterOperator = {
		label: string;
		value: (typeof numberFilterOperators)[number];
		icon: any;
	};

	type StringFilterOperator = {
		label: string;
		value: (typeof stringFilterOperators)[number];
		icon: any;
	};

	type SelectFilterOperator = {
		label: string;
		value: (typeof selectFilterOperators)[number];
		icon: any;
	};

	const numberOperators: NumberFilterOperator[] = [
		{
			label: 'Equals',
			value: 'equals',
			icon: Equals
		},
		{
			label: 'Not equals',
			value: 'notEquals',
			icon: NotEquals
		},
		{
			label: 'Greater than',
			value: 'greaterThan',
			icon: GreaterThan
		},
		{
			label: 'Less than',
			value: 'lessThan',
			icon: LessThan
		},
		{
			label: 'Greater than or equal to',
			value: 'greaterThanOrEqual',
			icon: GreateThanOrEqualTo
		},
		{
			label: 'Less than or equal to',
			value: 'lessThanOrEqual',
			icon: LessThanOrEqualTo
		},
		{
			label: 'Between',
			value: 'between',
			icon: Between
		},
		{
			label: 'Empty',
			value: 'empty',
			icon: Empty
		},
		{
			label: 'Not empty',
			value: 'notEmpty',
			icon: NotEmpty
		}
	];

	const stringOperators: StringFilterOperator[] = [
		{
			label: 'Equals',
			value: 'equals',
			icon: Equals
		},
		{
			label: 'Not equals',
			value: 'notEquals',
			icon: NotEquals
		},
		{
			label: 'Contains',
			value: 'contains',
			icon: Contains
		},
		{
			label: 'Starts with',
			value: 'startsWith',
			icon: StartsWith
		},
		{
			label: 'Ends with',
			value: 'endsWith',
			icon: EndsWith
		},
		{
			label: 'Empty',
			value: 'empty',
			icon: Empty
		},
		{
			label: 'Not empty',
			value: 'notEmpty',
			icon: NotEmpty
		}
	];

	const selectOperators: SelectFilterOperator[] = [
		{
			label: 'Equals',
			value: 'equals',
			icon: Equals
		},
		{
			label: 'Not equals',
			value: 'notEquals',
			icon: NotEquals
		}
	];

	let { datagrid, column }: { datagrid: DataGrid<any>; column: AnyColumn<any> } = $props();
</script>

{#snippet FilterOperator(
	operators: (NumberFilterOperator | StringFilterOperator | SelectFilterOperator)[]
)}
	{#each operators as operator}
		<DropdownMenu.Item
			onclick={() =>
				datagrid.handlers.filtering.changeFilterOperator(column.columnId, operator.value)}
		>
			<operator.icon class="mr-2 size-4" />
			<span>{operator.label}</span>
		</DropdownMenu.Item>
	{/each}
{/snippet}

{#if isGroupColumn(column)}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class={cn(buttonVariants({ variant: 'ghost' }), 'size-4 p-2 ')}>
			<MoreVert />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-56">
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading>{column.header} Group</DropdownMenu.GroupHeading>
				<DropdownMenu.Separator />
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<MoveUp class="mr-2 size-4" />
						<span>Move to</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Item
							closeOnSelect={false}
							onclick={() =>
								datagrid.handlers.columnOrdering.moveColumnToGroup({
									columnId: column.columnId,
									targetGroupColumnId: ''
								})}
						>
							<div class="flex flex-row gap-2">
								<span>Root level</span>
							</div>
						</DropdownMenu.Item>
						{#each datagrid.columnManager.getGroupColumns() as groupCol}
							<DropdownMenu.Item
								closeOnSelect={false}
								onclick={() =>
									datagrid.handlers.columnOrdering.moveColumnToGroup({
										columnId: column.columnId,
										targetGroupColumnId: groupCol.columnId
									})}
							>
								<div class="flex flex-row gap-2">
									<span>{groupCol.header}</span>
								</div>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{:else}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class={cn(buttonVariants({ variant: 'ghost' }), 'size-4 p-2 ')}>
			<MoreVert />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-56">
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading>{column.header}</DropdownMenu.GroupHeading>
				<DropdownMenu.Separator />

				<DropdownMenu.Item onclick={() => datagrid.handlers.sorting.unSortColumn(column)}>
					<ArrowsSort class="mr-2 size-4" />
					<span>Clear sort</span>
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onclick={() => datagrid.handlers.sorting.sortColumnAscending(column)}
				>
					<SortAscending class="mr-2 size-4" />
					<span>Sort ascending </span>
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onclick={() => datagrid.handlers.sorting.sortColumnDescending(column)}
				>
					<SortDescending class="mr-2 size-4" />
					<span>Sort descending </span>
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<FilterX class="mr-2 size-4" />
					<span>Clear filter</span>
				</DropdownMenu.Item>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger
						disabled={!column._meta.filterType || column.options.filterable === false}
						class="aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
					>
						<FilterCog class="mr-2 size-4" />
						<span>Filter operator</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						{#if column._meta.filterType === 'number'}
							{@render FilterOperator(numberOperators)}
						{/if}
						{#if column._meta.filterType === 'text'}
							{@render FilterOperator(stringOperators)}
						{/if}
						{#if column._meta.filterType === 'select'}
							{@render FilterOperator(selectOperators)}
						{/if}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>

				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={() => datagrid.handlers.grouping.toggle(column.columnId)}>
					{#if datagrid.features.grouping.isColumnWithinGroup(column.columnId)}
						<AdGroupOffOutlineSharp class="mr-2 size-4" />
						<span>Ungroup by {column.header}</span>
					{:else}
						<AdGroupOutlineSharp class="mr-2 size-4" />
						<span>Group by {column.header}</span>
					{/if}
				</DropdownMenu.Item>
				<DropdownMenu.Separator />

				<DropdownMenu.Item
					onclick={() => datagrid.handlers.columnPinning.pinColumn(column.columnId, 'left')}
				>
					<FreezeColumn class="mr-2 size-4" />
					<span>Pin to left</span>
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onclick={() => datagrid.handlers.columnPinning.pinColumn(column.columnId, 'right')}
				>
					<FreezeColumn class="mr-2 size-4 rotate-180" />
					<span>Pin to right</span>
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onclick={() => datagrid.handlers.columnPinning.pinColumn(column.columnId, 'none')}
				>
					<ColumnsOff class="mr-2 size-4" />
					<span>Unpin</span>
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<VisibilityOff class="mr-2 size-4" />
					<span>Hide column</span>
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					onclick={() => datagrid.handlers.columnOrdering.moveLeft(column.columnId)}
					closeOnSelect={false}
				>
					<ArrowMoveLeft class="mr-2 size-4" />
					<span>Move left</span>
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onclick={() => datagrid.handlers.columnOrdering.moveRight(column.columnId)}
					closeOnSelect={false}
				>
					<ArrowMoveRight class="mr-2 size-4" />
					<span>Move right</span>
				</DropdownMenu.Item>

				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<MoveUp class="mr-2 size-4" />
						<span>Move to</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Item
							closeOnSelect={false}
							onclick={() =>
								datagrid.handlers.columnOrdering.moveColumnToGroup({
									columnId: column.columnId,
									targetGroupColumnId: ''
								})}
						>
							<div class="flex flex-row gap-2">
								<span>Root level</span>
							</div>
						</DropdownMenu.Item>
						{#each datagrid.columnManager.getGroupColumns() as groupCol}
							<DropdownMenu.Item
								closeOnSelect={false}
								onclick={() =>
									datagrid.handlers.columnOrdering.moveColumnToGroup({
										columnId: column.columnId,
										targetGroupColumnId: groupCol.columnId
									})}
							>
								<div class="flex flex-row gap-2">
									<span>{groupCol.header}</span>
								</div>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
