<script lang="ts">
	import CirclePlus from 'lucide-svelte/icons/circle-plus';
	import Cloud from 'lucide-svelte/icons/cloud';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import Github from 'lucide-svelte/icons/github';
	import Keyboard from 'lucide-svelte/icons/keyboard';
	import LifeBuoy from 'lucide-svelte/icons/life-buoy';
	import LogOut from 'lucide-svelte/icons/log-out';
	import Mail from 'lucide-svelte/icons/mail';
	import MessageSquare from 'lucide-svelte/icons/message-square';
	import Plus from 'lucide-svelte/icons/plus';
	import Settings from 'lucide-svelte/icons/settings';
	import User from 'lucide-svelte/icons/user';
	import UserPlus from 'lucide-svelte/icons/user-plus';
	import Users from 'lucide-svelte/icons/users';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import MoreVert from '$lib/datagrid/icons/material-symbols/more-vert.svelte';
	import { cn } from '$lib/utils';
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
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
	import Visibility from '$lib/datagrid/icons/material-symbols/visibility.svelte';
	import ArrowMoveLeft from '$lib/datagrid/icons/tabler/arrow-move-left.svelte';
	import ArrowMoveRight from '$lib/datagrid/icons/tabler/arrow-move-right.svelte';
	import MoveUp from '$lib/datagrid/icons/material-symbols/move-up.svelte';
	import { isGroupColumn } from '$lib/datagrid/core/column-guards';
	import type { AnyColumn } from '$lib/datagrid/core/column-creation/types';

	let { datagrid, column }: { datagrid: Datagrid<any>; column: AnyColumn<any> } = $props();
</script>

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
				<DropdownMenu.Item onclick={() => datagrid.handlers.sorting.sortColumnAscending(column)}>
					<SortAscending class="mr-2 size-4" />
					<span>Sort ascending </span>
				</DropdownMenu.Item>
				<DropdownMenu.Item onclick={() => datagrid.handlers.sorting.sortColumnDescending(column)}>
					<SortDescending class="mr-2 size-4" />
					<span>Sort descending </span>
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<FilterX class="mr-2 size-4" />
					<span>Clear filter</span>
				</DropdownMenu.Item>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<FilterCog class="mr-2 size-4" />
						<span>Filter operator</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Item>
							<Mail class="mr-2 size-4" />
							<span>Contains</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<MessageSquare class="mr-2 size-4" />
							<span>Starts with</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<CirclePlus class="mr-2 size-4" />
							<span>Ends with</span>
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							<MessageSquare class="mr-2 size-4" />
							<span>Equals</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<MessageSquare class="mr-2 size-4" />
							<span>Not equals</span>
						</DropdownMenu.Item>

						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							<MessageSquare class="mr-2 size-4" />
							<span>Between</span>
						</DropdownMenu.Item><DropdownMenu.Item>
							<MessageSquare class="mr-2 size-4" />
							<span>Between inclusive</span>
						</DropdownMenu.Item><DropdownMenu.Item>
							<MessageSquare class="mr-2 size-4" />
							<span>Greater than</span>
						</DropdownMenu.Item><DropdownMenu.Item>
							<MessageSquare class="mr-2 size-4" />
							<span>Greater than or equal to</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<MessageSquare class="mr-2 size-4" />
							<span>Less than</span>
						</DropdownMenu.Item>

						<DropdownMenu.Separator />

						<DropdownMenu.Item>
							<MessageSquare class="mr-2 size-4" />
							<span>Less than or equal to</span>
						</DropdownMenu.Item>

						<DropdownMenu.Item>
							<MessageSquare class="mr-2 size-4" />
							<span>Empty</span>
						</DropdownMenu.Item>

						<DropdownMenu.Item>
							<MessageSquare class="mr-2 size-4" />
							<span>Not empty</span>
						</DropdownMenu.Item>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>

				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={() => datagrid.handlers.grouping.toggle(column.columnId)}>
					{#if datagrid.grouping.isColumnWithinGroup(column.columnId)}
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
