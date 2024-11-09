import type { TopBarOptions } from "$lib/datagrid/tzezar-datagrid.svelte";

export const topbar = {
    display: true,
    settingsMenu: {
        display: true,
        displayFreezingMenu: false,
        displayReorderingMenu: false,
        displayResizingMenu: true,
        displaySortingMenu: false,
        displayVisibilityMenu: false,
        adjustmentMenu: {
            display: false
        }
    }
} satisfies TopBarOptions