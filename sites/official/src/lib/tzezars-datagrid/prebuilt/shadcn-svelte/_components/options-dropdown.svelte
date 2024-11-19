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
	import Sort from '../../icons/material-symbols/sort.svelte';
	import StabilizationLock from '../../icons/material-symbols/stabilization-lock.svelte';
	import Width from '../../icons/material-symbols/width.svelte';
	import Visibility from '../../icons/material-symbols/visibility.svelte';
	import MoveUp from '../../icons/material-symbols/move-up.svelte';
	import Padding from '../../icons/material-symbols/padding.svelte';
	import TextIncrease from '../../icons/material-symbols/text-increase.svelte';
	import Save from '../../icons/material-symbols/save.svelte';
	import ContentCopy from '../../icons/material-symbols/content-copy.svelte';
	import type { Datagrid } from '$lib/tzezars-datagrid/core/index.svelte';
	import MoveDown from '../../icons/material-symbols/move-down.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import VisibilityOff from '../../icons/material-symbols/visibility-off.svelte';
	import { Slider } from '$lib/components/ui/slider';
	import type { Column } from '$lib/tzezars-datagrid/core/processors/column-processor.svelte';
	import type { PinningPosition } from '$lib/tzezars-datagrid/core/features/column-manager.svelte';
	import FileTypeXls from '../../icons/tabler/file-type-xls.svelte';
	import FileTypeCsv from '../../icons/tabler/file-type-csv.svelte';
	import FileTypeXml from '../../icons/tabler/file-type-xml.svelte';
	import FileSave from '../../icons/material-symbols/file-save.svelte';
	import FilterAlt from '../../icons/material-symbols/filter-alt.svelte';
	import Folder from '../../icons/material-symbols/folder.svelte';
	import TableRows from '../../icons/material-symbols/table-rows.svelte';
	import FileCopy from '../../icons/material-symbols/file-copy.svelte';

	let { grid }: { grid: Datagrid<any, any> } = $props();

	const handleColumnResize = (column: Column<any, never>, width: number) => {
		grid.columnManager.resizeColumn(column, Number(width));
		grid.columnManager.refreshColumnPinningOffsets();
	};

	const handleColumnPinningChange = (column: Column<unknown, never>, position: PinningPosition) => {
		grid.columnManager.changeColumnPinningPosition(column, position);
		grid.columnManager.refreshColumnPinningOffsets();
	};

	const pinningOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'left', label: 'Left' },
		{ value: 'right', label: 'Right' }
	];
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' })}>
		<Settings />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>General settings</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<Sort class="mr-2 size-4" />
						<span>Sorting</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						{#each grid.columns as column}
							<DropdownMenu.Item
								disabled={column.sortable === false}
								closeOnSelect={false}
								onclick={() => grid.reload(() => grid.sorting.toggleSort(column.columnId))}
							>
								<span>{column.header}</span>
								<span class="ml-auto text-nowrap text-xs">
									{column.getSortingDirection() === 'asc'
										? `▲ ${grid.sorting.getColumnSortPosition(column)}`
										: column.getSortingDirection() === 'desc'
											? `▼ ${grid.sorting.getColumnSortPosition(column)}`
											: ' '}
								</span>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<StabilizationLock class="mr-2 size-4" />
						<span>Pinning</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						{#each grid.columns as column}
							<!-- ? TODO Many errors happend with shadcn-svelte dropdown-menu-item implementation combined with select component or
							even html select element; eg. it was not possible to select anything, or select value did not update, or typescript errors happend
							if you will be able to make it work i will be glad for git PR  
							-->
							<div>
								<select
									value={column.pinning.position}
									disabled={column.pinnable === false}
									onchange={(e) =>
										handleColumnPinningChange(column, e.currentTarget.value as PinningPosition)}
								>
									<option value="none">none</option>
									<option value="left">left</option>
									<option value="right">right</option>
								</select>
								<span class='text-sm'>{column.header}</span>
							</div>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<Width class="mr-2 size-4" />
						<span>Resizing</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						{#each grid.columns as column}
							<DropdownMenu.Item
								closeOnSelect={false}
								disabled={column.resizable === false}
								class="item flex flex-col"
							>
								<span class="w-full text-left">{column.header}</span>
								<!-- ? TODO Can not make it with shadcn-svelte Slider component-->
								<input
									disabled={column.resizable === false}
									type="range"
									min={column.size.minWidth}
									max={column.size.maxWidth}
									value={column.size.width}
									onchange={(e) => handleColumnResize(column, +e.currentTarget.value)}
								/>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>

				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<Visibility class="mr-2 size-4" />
						<span>Visibility</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						{#each grid.columns as column}
							<DropdownMenu.Item
								closeOnSelect={false}
								disabled={column.hideable === false}
								onclick={() => grid.columnManager.toggleColumnVisibility(column)}
							>
								{#if column.visible === true}
									<Visibility class="mr-2 size-4" />
								{:else}
									<VisibilityOff class="mr-2 size-4" />
								{/if}
								<span>{column.header}</span>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<MoveUp class="mr-2 size-4" />
						<span>Reordering</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						{#each grid.columns as column}
							<DropdownMenu.Item closeOnSelect={false}>
								<Button
									size="icon"
									onclick={() => grid.columnManager.moveColumnLeft(column)}
									disabled={column.movable === false ||
										!grid.columnManager.canMoveColumnLeft(column)}
								>
									<MoveUp class="size-4" />
								</Button>
								<Button
									size="icon"
									onclick={() => grid.columnManager.moveColumnRight(column)}
									disabled={column.movable === false ||
										!grid.columnManager.canMoveColumnRight(column)}
								>
									<MoveDown class="size-4" />
								</Button>
								<span>{column.header}</span>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.GroupHeading>Content</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>
					<FileSave class="mr-2 size-4" />
					<span>Save to file</span>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent>
					<DropdownMenu.Item>
						<FileTypeXls class="size-4" />
						<span>Excel</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<FileTypeCsv class="size-4" />
						<span>CSV</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<FileTypeXml class="size-4" />
						<span>XML</span>
					</DropdownMenu.Item>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>
					<ContentCopy class="mr-2 size-4" />
					<span>Copy to clipboard</span>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent>
					<DropdownMenu.Item>
						<Folder class="size-4" />
						<span>Whole data</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<FilterAlt class="size-4" />
						<span>Filtered data</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<TableRows class="size-4" />
						<span>Selected rows</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<FileCopy class="size-4" />
						<span>Current page</span>
					</DropdownMenu.Item>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Separator />
			<DropdownMenu.GroupHeading>Display preferences</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<Padding class="mr-2 size-4" />
						<span>Padding</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Item>
							<span>Small</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<span>Medium</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<span>Large</span>
						</DropdownMenu.Item>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<TextIncrease class="mr-2 size-4" />
						<span>Text size</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Item>
							<span>Small</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<span>Medium</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<span>Large</span>
						</DropdownMenu.Item>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			</DropdownMenu.Group>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
