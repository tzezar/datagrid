<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { EnhancedDatagrid } from '$lib/datagrid-enhanced/core/index.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { AutoColumnPosition } from '$lib/datagrid-enhanced/core/types';

	type Props = {
		datagrid: EnhancedDatagrid<any>;
	};

	let { datagrid }: Props = $props();
</script>

<div>
    <p>Toolbar visibility</p>
	<div>
		<Select.Root
			type="single"
			value={datagrid.customization.toolbar.shouldDisplayToolbar() ? 'true' : 'false'}
			onValueChange={(value) => {
                let state = value === 'true';

				datagrid.customization.toolbar.changeToolbarVisibility(state);
			}}
		>
			<Select.Trigger class="">
				{datagrid.customization.toolbar.shouldDisplayToolbar() ? 'Show' : 'Hide'}
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="true">Show</Select.Item>
				<Select.Item value="false">Hide</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>
    <p>Global search visibility</p>
	<div>
		<Select.Root
			type="single"
			value={datagrid.customization.toolbar.shouldDisplayGlobalSearchInput() ? 'true' : 'false'}
			onValueChange={(value) => {
                let state = value === 'true';

				datagrid.customization.toolbar.changeGlobalSearchInputVisibility(state);
			}}
		>
			<Select.Trigger class="">
				{datagrid.customization.toolbar.shouldDisplayGlobalSearchInput() ? 'Show' : 'Hide'}
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="true">Show</Select.Item>
				<Select.Item value="false">Hide</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>
	<p>Fullscreen toggler</p>
	<div>
		<Select.Root
			type="single"
			value={datagrid.customization.toolbar.shouldDisplayFullscreenToggleButton() ? 'true' : 'false'}
			onValueChange={(value) => {
                let state = value === 'true';

				datagrid.customization.toolbar.changeFullscreenModeTogglerVisibility(state);
			}}
		>
			<Select.Trigger class="">
				{datagrid.customization.toolbar.shouldDisplayFullscreenToggleButton() ? 'Show' : 'Hide'}
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="true">Show</Select.Item>
				<Select.Item value="false">Hide</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>
    <p>Filter toggler</p>
	<div>
		<Select.Root
			type="single"
			value={datagrid.customization.toolbar.shouldDisplayColumnFilteringToggler() ? 'true' : 'false'}
			onValueChange={(value) => {
                let state = value === 'true';

				datagrid.customization.toolbar.changeColumnFilteringTogglerVisibility(state);
			}}
		>
			<Select.Trigger class="">
				{datagrid.customization.toolbar.shouldDisplayColumnFilteringToggler() ? 'Show' : 'Hide'}
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="true">Show</Select.Item>
				<Select.Item value="false">Hide</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>
    <p>Control center</p>
	<div>
		<Select.Root
			type="single"
			value={datagrid.customization.toolbar.shouldDisplayControlCenter() ? 'true' : 'false'}
			onValueChange={(value) => {
                let state = value === 'true';

				datagrid.customization.toolbar.changeControlCenterVisibility(state);
			}}
		>
			<Select.Trigger class="">
				{datagrid.customization.toolbar.shouldDisplayControlCenter() ? 'Show' : 'Hide'}
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="true">Show</Select.Item>
				<Select.Item value="false">Hide</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>
</div>
