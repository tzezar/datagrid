<script lang="ts">
	import CirclePlus from 'lucide-svelte/icons/circle-plus';

	import Keyboard from 'lucide-svelte/icons/keyboard';
	import Mail from 'lucide-svelte/icons/mail';
	import MessageSquare from 'lucide-svelte/icons/message-square';
	import Settings from 'lucide-svelte/icons/settings';
	import UserPlus from 'lucide-svelte/icons/user-plus';
	import Users from 'lucide-svelte/icons/users';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import type { GridBasicRow, LeafColumn } from '$lib/datagrid/core/types';
	import MoreVert from '$lib/datagrid/icons/material-symbols/more-vert.svelte';
	import { cn } from '$lib/utils';
	import MoveUp from '$lib/datagrid/icons/material-symbols/move-up.svelte';
	import MoveDown from '$lib/datagrid/icons/material-symbols/move-down.svelte';
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';

	let {
		datagrid,
		column,
		row
	}: { datagrid: DataGrid<any>; column: LeafColumn<any>; row: GridBasicRow<any> } = $props();

	console.log('To be implemented');
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={cn(buttonVariants({ variant: 'ghost' }), 'size-4 p-2 ')}
		><MoreVert /></DropdownMenu.Trigger
	>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Group>
			<DropdownMenu.Item onclick={() => datagrid.handlers.rowPinning.pinRowTop(row.identifier)}>
				<MoveUp class="mr-2 size-4" />
				<span>Pin to top</span>
				<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => datagrid.handlers.rowPinning.pinRowBottom(row.identifier)}>
				<MoveDown class="mr-2 size-4" />
				<span>Pin to bottom</span>
				<DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<!-- <DropdownMenu.Item>
				<Settings class="mr-2 size-4" />
				<span>Sort {column.header} descending </span>
				<DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				<Keyboard class="mr-2 size-4" />
				<span>Clear filter</span>
				<DropdownMenu.Shortcut>⌘K</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>
					<UserPlus class="mr-2 size-4" />
					<span>Filter by {column.header}</span>
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
			<DropdownMenu.Item>
				<Users class="mr-2 size-4" />
				<span>Group by {column.header}</span>
			</DropdownMenu.Item>
			<DropdownMenu.Separator />

			<DropdownMenu.Item>
				<Users class="mr-2 size-4" />
				<span>Pin to left</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<Users class="mr-2 size-4" />
				<span>Pin to right</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<Users class="mr-2 size-4" />
				<span>Unpin</span>
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				<Users class="mr-2 size-4" />
				<span>Hide {column.header} column</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<Users class="mr-2 size-4" />
				<span>Show all columns</span>
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				<Users class="mr-2 size-4" />
				<span>Move left</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<Users class="mr-2 size-4" />
				<span>Move right</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<Users class="mr-2 size-4" />
				<span>Move to group or root</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<Users class="mr-2 size-4" />
				<span>Create group</span>
			</DropdownMenu.Item> -->
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
