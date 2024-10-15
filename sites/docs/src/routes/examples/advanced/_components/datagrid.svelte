<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import MaterialSymbolsLightDeleteOutline from '$lib/datagrid/icones/MaterialSymbolsLightDeleteOutline.svelte'; 
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';
	import Button from '$lib/components/ui/button/button.svelte';
	import { removeRow } from '$lib/datagrid/fns/remove-row';
	import { cn } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import EditForm from './edit-form.svelte';
	import ExpandedRowContent from './expanded-row-content.svelte';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { getNestedValue } from '$lib/datagrid/fns/get-nested-value';
	import CellWithContextMenu from './cell-with-context-menu.svelte';
	import CustomPagination from './custom-pagination.svelte';

	let datagrid = setContext(
		`datagrid`,
		new TzezarDatagrid({
			title: 'Inventory',
			data,
			columns,
			options: {
				pagination: { display: false },
				rows: { striped: true },
				footer: { display: true },
				topbar: {
					display: true,
					displayCopyDataMenu: true,
					displayExportDataMenu: true,
					displayFullscreenToggle: true,
					displayHeadFilterToggle: true,
					settingsMenu: {
						adjustmentMenu: {
							display: true,
							displaySpacingMenu: true,
							displayTextSizeMenu: true
						},
						displayFreezingMenu: true,
						displayReorderingMenu: true,
						displayResizingMenu: true,
						displaySortingMenu: true,
						displayVisibilityMenu: true,
						display: true
					}
				}
			}
		})
	);
</script>

<Datagrid.Datagrid>
	{#snippet topBar()}
		<Datagrid.TopBar />
	{/snippet}
	{#snippet head()}
		{#each datagrid.columns as column, i (column.id)}
			{#if column.id === 'checkbox'}
				<Datagrid.HeaderWithoutSpacing {column} title={column.title}>
					<Datagrid.HeaderRowSelectionDropdown />
				</Datagrid.HeaderWithoutSpacing>
			{:else if column.id === 'expand'}
				<Datagrid.HeaderWithoutSpacing {column} title="" class={{ container: '' }} />
			{:else}
				<Datagrid.Header {column} class={{ header: '' }}>
					{#snippet filter()}
						<Datagrid.ColumnFilter {column} />
					{/snippet}
				</Datagrid.Header>
			{/if}
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.internal.paginatedData as row, rowIndex}
			<Datagrid.Row rowId={row.id} {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					{@const props = { row, rowIndex, column, columnIndex }}

					{#if column.id === 'checkbox'}
						<Datagrid.CellWithoutSpacing {...props}>
							<Datagrid.CellRowSelectionCheckbox {row} />
						</Datagrid.CellWithoutSpacing>
					{:else if column.id === 'expand'}
						<Datagrid.CellWithoutSpacing {...props}>
							<Datagrid.ExpandRowToggler rowId={row.id} />
						</Datagrid.CellWithoutSpacing>
					{:else if column.id === 'actions'}
						<Datagrid.Cell {row} {column} {columnIndex} {rowIndex}>
							<div class={cn('flex flex-row gap-2')}>
								<Button
									size="sm"
									variant="destructive"
									onclick={() => {
										datagrid.updateData(removeRow(row.id, datagrid));
										toast.success('Row removed');
									}}
								>
									<MaterialSymbolsLightDeleteOutline />
								</Button>
								<EditForm />
							</div>
						</Datagrid.Cell>
					{:else}
						<ContextMenu.Root>
							<ContextMenu.Trigger asChild let:builder>
								<CellWithContextMenu
									{builder}
									{...props}
									class={{ data: 'overflow-hidden text-ellipsis text-nowrap' }}
								/>
							</ContextMenu.Trigger>
							<ContextMenu.Content>
								<ContextMenu.Item>{getNestedValue(row, column.id)}</ContextMenu.Item>
							</ContextMenu.Content>
						</ContextMenu.Root>
					{/if}
				{/each}
			</Datagrid.Row>
			{#if Datagrid.isRowExpanded(datagrid, row.id)}
				<Datagrid.Row
					class={`border-b ${Datagrid.STAY_IN_PLACE} ${Datagrid.HIDE_BEHIND_PARENT_ROW}`}
					{rowIndex}
				>
					<div class="p-2 pl-3">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum deserunt tenetur debitis
						praesentium aliquam error quibusdam explicabo nam voluptates, dignissimos minima quasi
						aliquid. Repellat, voluptatibus. Natus cumque temporibus nostrum quos. Assumenda
						laboriosam nostrum laborum impedit dolorem consectetur praesentium doloribus iusto
						accusamus recusandae! Sint, natus dolorem perferendis nesciunt similique nihil optio
						repellat adipisci ad expedita numquam quaerat incidunt cum consectetur praesentium.
						Pariatur tempore delectus sunt necessitatibus at voluptatum beatae molestias ratione
						modi nostrum a neque dolor illo magnam vero, natus dolorem, corporis eum aspernatur
						quaerat? Quibusdam ab velit neque rerum excepturi.
					</div>
				</Datagrid.Row>
			{/if}
		{/each}
	{/snippet}
	{#snippet footer()}
		<div
			class="grid grid-cols-3 items-center p-2 pl-3"
			data-datagrid-footer-identifier={datagrid.identifier}
		>
			<span>
				Showing {datagrid.internal.paginatedData.length * datagrid.state.pagination.page -
					datagrid.state.pagination.perPage}
				:
				{datagrid.internal.paginatedData.length * datagrid.state.pagination.page}
				of
				{datagrid.state.pagination.count}
			</span>
			<div class="flex items-center justify-center">
				<CustomPagination />
			</div>
			<span class="flex justify-end">Page {datagrid.state.pagination.page}</span>
		</div>
	{/snippet}
</Datagrid.Datagrid>

<!-- <Datagrid.Datagrid>
	{#snippet topBar()}
		<Datagrid.TopBar />
	{/snippet}
	{#snippet head()}
		{#each datagrid.columns as column, i (column.id)}
			{#if column.id === 'checkbox'}
				<Datagrid.HeaderWithoutSpacing {column} title={column.title}>
					<Datagrid.HeaderRowSelectionDropdown />
				</Datagrid.HeaderWithoutSpacing>
			{:else if column.id === 'expand'}
				<Datagrid.HeaderWithoutSpacing {column} title="" class={{ container: '' }} />
			{:else}
				<Datagrid.Header {column} class={{ header: '' }}>
					{#snippet filter()}
						<Datagrid.ColumnFilter {column} />
					{/snippet}
				</Datagrid.Header>
			{/if}
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.internal.paginatedData as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					{#if column.id === 'checkbox'}
						<Datagrid.CellWithoutSpacing {row} {column} {columnIndex} {rowIndex}>
							<Datagrid.CellRowSelectionCheckbox {row} />
						</Datagrid.CellWithoutSpacing>
					{:else if column.id === 'expand'}
						<Datagrid.CellWithoutSpacing {row} {column} {columnIndex} {rowIndex}>
							<Datagrid.ExpandRowToggler rowId={row.id} />
						</Datagrid.CellWithoutSpacing>
					{:else if column.id === 'actions'}
						<Datagrid.Cell {row} {column} {columnIndex} {rowIndex}>
							<div class={cn('flex flex-row gap-2')}>
								<Button
									size="sm"
									variant="destructive"
									onclick={() => {
										datagrid.updateData(removeRow(row.id, datagrid));

										toast.success('Row removed');
									}}
								>
									<MaterialSymbolsDeleteOutline />
								</Button>
								<EditForm />
							</div>
						</Datagrid.Cell>
					{:else if column.id === 'quantity'}
						<Datagrid.Cell
							{row}
							{column}
							{columnIndex}
							{rowIndex}
							class={{
								cell: cn(row['quantity'] < 200 && 'text-red-500 border-red-500')
							}}
						/>
					{:else if column.id === 'price'}
						<Datagrid.Cell
							{row}
							{column}
							{columnIndex}
							{rowIndex}
							class={{
								cell: cn(row['price'] < 400 && 'text-green-500 border-r-green-500')
							}}
						/>
					{:else}
						<ContextMenu.Root>
							<ContextMenu.Trigger asChild let:builder>
								<CellWithContextMenu
									{builder}
									{columnIndex}
									{rowIndex}
									{column}
									{row}
									class={{ data: 'overflow-hidden text-ellipsis text-nowrap' }}
								/>
							</ContextMenu.Trigger>
							<ContextMenu.Content>
								<ContextMenu.Item>{getNestedValue(row, column.id)}</ContextMenu.Item>
							</ContextMenu.Content>
						</ContextMenu.Root>
					{/if}
				{/each}
			</Datagrid.Row>
			{#if Datagrid.isRowExpanded(datagrid, row.id)}
				<Datagrid.Row
					class={`border-b ${Datagrid.STAY_IN_PLACE} ${Datagrid.HIDE_BEHIND_PARENT_ROW}`}
					{rowIndex}
				>
					<ExpandedRowContent />
				</Datagrid.Row>
			{/if}
		{/each}
	{/snippet}
	{#snippet footer()}
		<div
			class="grid grid-cols-3 items-center p-2 pl-3"
			data-datagrid-footer-identifier={datagrid.identifier}
		>
			<span>
				Showing {datagrid.internal.paginatedData.length * datagrid.state.pagination.page -
					datagrid.state.pagination.perPage}
				:
				{datagrid.internal.paginatedData.length * datagrid.state.pagination.page}
				of
				{datagrid.state.pagination.count}
			</span>
			<div class="flex items-center justify-center">
				<CustomPagination />
			</div>
			<span class="flex justify-end">Page {datagrid.state.pagination.page}</span>
		</div>
	{/snippet}
</Datagrid.Datagrid> -->
