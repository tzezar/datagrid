import type { AnyColumn, GroupColumn } from "$lib/datagrid/core/column-creation/types";
import { DataGrid, type GridConfig } from "$lib/datagrid/core/index.svelte";
import { LifecycleHooks } from "$lib/datagrid/core/managers/lifecycle-hooks-manager.svelte";
import { ColumnProcessor } from "$lib/datagrid/core/processors";
import { flattenColumnStructureAndClearGroups } from "$lib/datagrid/core/utils.svelte";
import { ColumnFilteringFeature } from "./features/column-filtering.svelte";
import { FullscreenFeature } from "./features/fullscreen.svelte";
import { GroupHeadersVisibilityFeature } from "./features/group-headers-visibility.svelte";



export type TzezarsDatagridConfig<TOriginalRow = any> = GridConfig<TOriginalRow> & {
    lifecycleHooks?: LifecycleHooks<TOriginalRow>;
}


function transformColumns(columns: AnyColumn<any>[]): AnyColumn<any>[] {
    const newCols = columns.map(col => {
        return {
            ...col,
            _meta: {
                ...col._meta,
                showColumnManagerDropdownMenu: col._meta?.showColumnManagerDropdownMenu ?? true
            }
        }
    })
    return newCols
}

export class TzezarsDatagrid<TOriginalRow = any> extends DataGrid<TOriginalRow> {
    constructor(config: TzezarsDatagridConfig<TOriginalRow>) {
        const columnProcessor = new ColumnProcessor<TOriginalRow>({} as DataGrid<TOriginalRow>);


        config.lifecycleHooks = new LifecycleHooks<TOriginalRow>();
        config.lifecycleHooks.register(LifecycleHooks.HOOKS.PRE_PROCESS_COLUMNS, (columns: AnyColumn<TOriginalRow>[]) => {
            const flattenedColumns = flattenColumnStructureAndClearGroups([...columns]);
            const transformedColumns = transformColumns([...flattenedColumns]);
            const hierarchicalColumns = columnProcessor.createColumnHierarchy(transformedColumns);
            return hierarchicalColumns
        });
        super(config);
    }
    extra = new Extra();


    isFullscreenEnabled() {
        return this.extra.features.fullscreen.isFullscreen;
    }

}

export class ExtraState {
    highlightSelectedRow = $state(true)
}

export class Extra {
    state = new ExtraState();
    features = {
        fullscreen: new FullscreenFeature(),
        groupHeadersVisibility: new GroupHeadersVisibilityFeature(),
        columnFiltering: new ColumnFilteringFeature()
    }

}