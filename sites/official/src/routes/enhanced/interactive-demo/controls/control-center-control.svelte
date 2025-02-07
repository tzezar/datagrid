<script lang="ts">
	import type { EnhancedDatagrid } from '$lib/datagrid-enhanced/core/index.svelte';

	type Props = {
		datagrid: EnhancedDatagrid<any>;
	};
	import { Switch } from '$lib/components/ui/switch/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	let { datagrid }: Props = $props();
</script>

<div>
	<p>Toolbar visibility</p>
	<Switch
		checked={datagrid.customization.toolbar.shouldDisplayToolbar()}
		onCheckedChange={(value) => {
			datagrid.customization.toolbar.changeToolbarVisibility(value);
		}}
	/>
	<p>Global search visibility</p>
	<Switch
		checked={datagrid.customization.toolbar.shouldDisplayGlobalSearchInput()}
		onCheckedChange={(value) => {
			datagrid.customization.toolbar.changeGlobalSearchInputVisibility(value);
		}}
	/>
	<p>Fullscreen toggler</p>
	<Switch
		checked={datagrid.customization.toolbar.shouldDisplayFullscreenToggleButton()}
		onCheckedChange={(value) => {
			datagrid.customization.toolbar.changeFullscreenModeTogglerVisibility(value);
		}}
	/>
	<p>Filter toggler</p>
	<Switch
		checked={datagrid.customization.toolbar.shouldDisplayColumnFilteringToggler()}
		onCheckedChange={(value) => {
			datagrid.customization.toolbar.changeColumnFilteringTogglerVisibility(value);
		}}
	/>
	<p>Control center</p>
	<Switch
		checked={datagrid.customization.toolbar.shouldDisplayControlCenter()}
		onCheckedChange={(value) => {
			datagrid.customization.toolbar.changeControlCenterVisibility(value);
		}}
	/>
	<p>Stripped rows</p>
	<Switch
		checked={datagrid.extra.features.stripedRows.isEnabled()}
		onCheckedChange={(value) => {
			datagrid.extra.features.stripedRows.changeEnabled(value);
		}}
	/>

	<p>Sorting indicators</p>
	<Switch
		checked={datagrid.customization.showColumnSortingIndicator}
		onCheckedChange={(value) => {
			datagrid.customization.showColumnSortingIndicator = value;
		}}
	/>
	<p>Sorting function toggler</p>
	<Switch
		checked={datagrid.customization.enableSorting}
		onCheckedChange={(value) => {
			datagrid.customization.enableSorting = value;
		}}
	/>
	<p>Column dropdown menu</p>
	<Switch
		checked={datagrid.customization.enableColumnDropdownMenu}
		onCheckedChange={(value) => {
			datagrid.customization.enableColumnDropdownMenu = value;
		}}
	/>

	<p>Control center options</p>
	<p>Sorting</p>
	<Switch
		checked={datagrid.customization.controlCenter.displaySortingMenu}
		onCheckedChange={(value) => {
			datagrid.customization.controlCenter.setSortingMenu(value);
		}}
	/>
	<p>Ordering</p>
	<Switch
		checked={datagrid.customization.controlCenter.displayOrderingMenu}
		onCheckedChange={(value) => {
			datagrid.customization.controlCenter.setOrderingMenu(value);
		}}
	/>
	<p>Visibility</p>
	<Switch
		checked={datagrid.customization.controlCenter.displayVisibilityMenu}
		onCheckedChange={(value) => {
			datagrid.customization.controlCenter.setVisibilityMenu(value);
		}}
	/>
	<p>Resizing</p>
	<Switch
		checked={datagrid.customization.controlCenter.displayResizingMenu}
		onCheckedChange={(value) => {
			datagrid.customization.controlCenter.setResizingMenu(value);
		}}
	/>
	<p>Pinning</p>
	<Switch
		checked={datagrid.customization.controlCenter.displayPinningMenu}
		onCheckedChange={(value) => {
			datagrid.customization.controlCenter.setPinningMenu(value);
		}}
	/>

	<p>Grouping</p>
	<Switch
		checked={datagrid.customization.controlCenter.displayGroupingMenu}
		onCheckedChange={(value) => {
			datagrid.customization.controlCenter.setGroupingMenu(value);
		}}
	/>
	<p>Exporting</p>
	<Switch
		checked={datagrid.customization.controlCenter.displayExportingMenu}
		onCheckedChange={(value) => {
			datagrid.customization.controlCenter.setExportingMenu(value);
		}}
	/>
	<p>Column group creation</p>
	<Switch
		checked={datagrid.customization.controlCenter.displayColumnGroupCreationMenu}
		onCheckedChange={(value) => {
			datagrid.customization.controlCenter.setColumnGroupCreationMenu(value);
		}}
	/>
	<p>Column group hiding btn</p>
	<Switch
		checked={datagrid.customization.controlCenter.displayHideColumnGroupsMenu}
		onCheckedChange={(value) => {
			datagrid.customization.controlCenter.setHideColumnGroupsMenu(value);
		}}
	/>

	<p>Column filters visibility</p>
	<Switch
		checked={datagrid.customization.toolbar.shouldDisplayToolbar()}
		onCheckedChange={(value) => {
			datagrid.customization.toolbar.changeToolbarVisibility(value);
		}}
	/>

	<p>Header dropdown</p>
	<p>Header dropdown sorting menu</p>
	<Switch
		checked={datagrid.customization.headerCellDropdownMenu.displayColumnSortingControls}
		onCheckedChange={(value) => {
			datagrid.customization.headerCellDropdownMenu.displayColumnSortingControls = value;
		}}
	/>
	<p>Header dropdown filtering menu</p>
	<Switch
		checked={datagrid.customization.headerCellDropdownMenu.displayColumnFiteringControls}
		onCheckedChange={(value) => {
			datagrid.customization.headerCellDropdownMenu.displayColumnFiteringControls = value;
		}}
	/>
	<p>Header dropdown grouping menu</p>
	<Switch
		checked={datagrid.customization.headerCellDropdownMenu.displayGroupingByColumnControls}
		onCheckedChange={(value) => {
			datagrid.customization.headerCellDropdownMenu.displayGroupingByColumnControls = value;
		}}
	/>
	<p>Header dropdown pinning menu</p>
	<Switch
		checked={datagrid.customization.headerCellDropdownMenu.displayColumnPinningControls}
		onCheckedChange={(value) => {
			datagrid.customization.headerCellDropdownMenu.displayColumnPinningControls = value;
		}}
	/>
	<p>Header dropdown visibility menu</p>
	<Switch
		checked={datagrid.customization.headerCellDropdownMenu.displayColumnVisibilityControls}
		onCheckedChange={(value) => {
			datagrid.customization.headerCellDropdownMenu.displayColumnVisibilityControls = value;
		}}
	/>
	<p>Header dropdown movement menu</p>
	<Switch
		checked={datagrid.customization.headerCellDropdownMenu.displayColumnMovementControls}
		onCheckedChange={(value) => {
			datagrid.customization.headerCellDropdownMenu.displayColumnMovementControls = value;
		}}
	/>

	<p>Max selected rows</p>
	<Input bind:value={datagrid.features.rowSelection.maxSelectedRows} type="number" />
	<p>Max expanded rows</p>
	<Input bind:value={datagrid.features.rowExpanding.maxExpandedRows} type="number" />

	<p>Body cell click to copy</p>
	<Switch
		checked={datagrid.extra.features.clickToCopy.display}
		onCheckedChange={(value) => {
			datagrid.extra.features.clickToCopy.display = value;
		}}
	/>

	<p>Body cell tooltips</p>
	<Switch
		checked={datagrid.customization.cellTooltips}
		onCheckedChange={(value) => {
			datagrid.customization.cellTooltips = value;
		}}
	/>
</div>
