<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	import { getContext } from 'svelte';
	import { toggleColumnPin } from '../fns/toggle-column-pin';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { TzezarDatagrid } from '../tzezar-datagrid.svelte';

	const datagrid = getContext<TzezarDatagrid>('datagrid');
</script>

<DropdownMenu.Root closeOnItemClick={false}>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} size="sm">Freezing</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
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
										onchange={() =>
											(datagrid.columns = toggleColumnPin(column.id, 'left', datagrid.columns))}
									/>
								</div>
							</div>
							<div class="flex flex-row gap-2">
								<div>
									<input
										type="checkbox"
										checked={column.pinned?.position === 'right'}
										onchange={() =>
											(datagrid.columns = toggleColumnPin(column.id, 'right', datagrid.columns))}
									/>
								</div>
							</div>
						</div>
					</div>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
