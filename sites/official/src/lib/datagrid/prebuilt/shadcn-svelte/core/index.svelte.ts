import type { AnyColumn, GroupColumn } from "$lib/datagrid/core/column-creation/types";
import { isGroupColumn } from "$lib/datagrid/core/helpers/column-guards";
import { DataGrid, type GridConfig } from "$lib/datagrid/core/index.svelte";
import type { LeafColumn } from "$lib/datagrid/core/types";
import { FullscreenFeature } from "./features/fullscreen.svelte";
import { GroupHeadersVisibilityFeature } from "./features/group-headers-visibility.svelte";

const handleDropdownMenu = (columns: AnyColumn<any>[]) => {
    columns.forEach((column) => {
        if (isGroupColumn(column)) {
            const groupColumn = column as GroupColumn<any>;
            handleDropdownMenu(groupColumn.columns);
        }
        column = column as LeafColumn<any>;
        column._meta.showColumnManagerDropdownMenu =
            column._meta.showColumnManagerDropdownMenu ?? true;
    });
    return columns;
};


export interface TzezarsDatagridConfig<TOriginalRow> extends GridConfig<TOriginalRow> {
    highlightSelectedRow?: boolean;
}


export class TzezarsDatagrid<TOriginalRow = any> extends DataGrid<TOriginalRow> {
    declare features: typeof DataGrid.prototype.features & {
        fullscreen: FullscreenFeature;
        groupHeadersVisibility: GroupHeadersVisibilityFeature;
    };

    constructor(config: TzezarsDatagridConfig<TOriginalRow>) {
        super(config, handleDropdownMenu);
        
        // Create a new features object that combines the parent features with our new ones
        Object.defineProperty(this, 'features', {
            value: {
                ...this.features,
                fullscreen: new FullscreenFeature(),
                groupHeadersVisibility: new GroupHeadersVisibilityFeature(),
            },
            writable: false,
            configurable: true
        });

        // Initialize extra configuration
        this.extra = {
            highlightSelectedRow: config.highlightSelectedRow ?? true,
        };
    }

    private extra: {
        highlightSelectedRow: boolean;
    };

    getExtra() {
        return { ...this.extra };
    }

    updateExtra(config: Partial<typeof this.extra>) {
        this.extra = {
            ...this.extra,
            ...config
        };
    }
}