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
							{#if getSortIndex(datagrid, column)}
								<span class="sort-index">{getSortIndex(datagrid, column)}</span>
							{/if}
							<!-- svelte-ignore svelte_component_deprecated -->
							<svelte:component this={getSortIcon(datagrid, column)} class="sort-icon" size={14} />
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