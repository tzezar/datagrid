import type { TopBarOptions } from "$lib/datagrid/tzezar-datagrid.svelte";

export const topBarOptions = {
    display: true,
    displayCopyDataMenu: false,
    displayExportDataMenu: false,
    displayFullscreenToggle: false,
    displayHeadFilterToggle: false,
    settingsMenu: {
        display: true,
        displayFreezingMenu: false,
        displayReorderingMenu: true,
        displayResizingMenu: false,
        displaySortingMenu: false,
        displayVisibilityMenu: false,
        adjustmentMenu: {
            display: false
        }
    }
} satisfies TopBarOptions