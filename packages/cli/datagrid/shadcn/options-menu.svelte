<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { getContext } from 'svelte';
	import { updateColumnWidth } from '../fns/update-column-width';
	import { cn } from '$lib/utils';
	import { moveColumn } from '../fns/move-column';
	import { toggleColumnPin } from '../fns/toggle-column-pin';
	import { toggleColumnVisibility } from '../fns/toggle-column-visibility';
	import MaterialSymbolsSettings from '~icons/material-symbols/settings';
	import { toggleSortingState } from '../fns/toggle-sorting-state';
	import { getSortingPosition } from '../fns/get-sorting-position';
	import { changeSpacingSize } from '../fns/change-spacing-size';
	import { changeFontSize } from '../fns/change-font-size';
	import type { TzezarDatagrid } from '../tzezar-datagrid.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { type FontSizeOptions, type SpacingOptions } from '../types';

	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');
</script>

<DropdownMenu.Root closeOnItemClick={false}>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} size="sm"><MaterialSymbolsSettings /></Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="">
		<DropdownMenu.Label>Column settings</DropdownMenu.Label>

		<DropdownMenu.Group>
			{#if datagrid.options.topbar.settingsMenu.displaySortingMenu}
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<span>Sorting</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
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
												{#if datagrid.state.sortingArray.find((s) => s.columnId === column.id)?.direction === 'asc'}
													<span class="">▲</span>
												{:else if datagrid.state.sortingArray.find((s) => s.columnId === column.id)?.direction === 'desc'}
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
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			{/if}
			{#if datagrid.options.topbar.settingsMenu.displayReoderingMenu}
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<span>Reordering</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Group class="min-w-40">
							{#each datagrid.columns as column, index}
								<DropdownMenu.Item disabled={column.moveable === false}>
									<div class={cn('flex w-full justify-between gap-4')}>
										<span class="">{column.title}</span>
										<div class="">
											<Button
												size="sm"
												onclick={() => moveColumn(index, -1, datagrid.columns)}
												disabled={column.moveable === false || index === 0}
											>
												▲
											</Button>
											<Button
												size="sm"
												onclick={() => moveColumn(index, 1, datagrid.columns)}
												disabled={column.moveable === false ||
													index === datagrid.columns.length - 1}
											>
												▼
											</Button>
										</div>
									</div>
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Group>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			{/if}
			{#if datagrid.options.topbar.settingsMenu.displayFreezingMenu}
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<span>Freezing</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Group>
							{#each datagrid.columns as column}
								<DropdownMenu.Item disabled={column.pinnable === false}>
									<div class="flex w-full justify-between gap-4">
										<span>{column.title}</span>
										<div class="ml-auto flex flex-row gap-4">
											<div class="flex flex-row gap-2">
												<div>
													<input
														type="checkbox"
														checked={column.pinned?.position === 'left'}
														onchange={() => {
															datagrid.columns = toggleColumnPin(
																column.id,
																'left',
																datagrid.columns
															);
														}}
													/>
												</div>
											</div>
											<div class="flex flex-row gap-2">
												<div>
													<input
														type="checkbox"
														checked={column.pinned?.position === 'right'}
														onchange={() =>
															(datagrid.columns = toggleColumnPin(
																column.id,
																'right',
																datagrid.columns
															))}
													/>
												</div>
											</div>
										</div>
									</div>
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Group>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			{/if}
			{#if datagrid.options.topbar.settingsMenu.displayResizingMenu}
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<span>Resizing</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Group class="min-w-40">
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
											min={80}
											max={500}
											step={50}
										/>
									</div>
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.Group>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			{/if}
			{#if datagrid.options.topbar.settingsMenu.displayVisibilityMenu}
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<span>Visibility</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Group class="min-w-40">
							{#each datagrid.columns as column}
								<DropdownMenu.CheckboxItem
									disabled={column.hideable === false}
									checked={column.visible !== false}
									onclick={() =>
										(datagrid.columns = toggleColumnVisibility(column.id, datagrid.columns))}
								>
									<p>{column.title}</p>
								</DropdownMenu.CheckboxItem>
							{/each}
						</DropdownMenu.Group>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			{/if}

			{#if datagrid.options.topbar.settingsMenu.adjustmentMenu.display}
				<DropdownMenu.Label>Display options</DropdownMenu.Label>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<span>Adjust spacing</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Group class="min-w-40">
							{#each Object.keys(datagrid.options.spacing.options) as key}
								<DropdownMenu.CheckboxItem
									checked={datagrid.options.spacing.selected.label == key}
									onclick={() => changeSpacingSize(key as keyof SpacingOptions, datagrid)}
								>
									<p>{key}</p>
								</DropdownMenu.CheckboxItem>
							{/each}
						</DropdownMenu.Group>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>

				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<span>Adjust textsize</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Group class="min-w-40">
							{#each Object.keys(datagrid.options.fontSize.options) as key}
								<DropdownMenu.CheckboxItem
									checked={datagrid.options.fontSize.selected.label == key}
									onclick={() => changeFontSize(key as keyof FontSizeOptions, datagrid)}
								>
									<p>{key}</p>
								</DropdownMenu.CheckboxItem>
							{/each}
						</DropdownMenu.Group>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			{/if}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
