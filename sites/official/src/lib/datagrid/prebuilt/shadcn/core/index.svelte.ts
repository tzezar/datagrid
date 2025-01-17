import type { AnyColumn } from "$lib/datagrid/core/types";
import { DataGrid, type GridConfig } from "$lib/datagrid/core/index.svelte";
import { LifecycleHooks } from "$lib/datagrid/core/managers/lifecycle-hooks-manager.svelte";
import { ColumnProcessor } from "$lib/datagrid/core/processors";
import { flattenColumnStructureAndClearGroups } from "$lib/datagrid/core/utils.svelte";
import { ColumnFilteringFeature } from "./features/column-filtering.svelte";
import { ExportingFeature } from "./features/exporting.svelte";
import { FullscreenFeature } from "./features/fullscreen.svelte";
import { GroupHeadersVisibilityFeature } from "./features/group-headers-visibility.svelte";



export type TzezarsDatagridConfig<TOriginalRow = any> = GridConfig<TOriginalRow> & {
    lifecycleHooks?: LifecycleHooks<TOriginalRow>;
    extra?: TzezarsDatagridExtraStateConfig;
}
export type TzezarsDatagridExtraStateConfig = {
    title?: string
    state?: {
        enableRowSelection?: boolean
        highlightSelectedRow?: boolean
        showCredentials?: boolean
        withPagination?: boolean
    }
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
    extra: Extra;

    constructor(config: TzezarsDatagridConfig<TOriginalRow>) {
        const columnProcessor = new ColumnProcessor<TOriginalRow>({} as DataGrid<TOriginalRow>);
        config.lifecycleHooks = new LifecycleHooks<TOriginalRow>();
        config.lifecycleHooks.register(
            LifecycleHooks.HOOKS.PRE_PROCESS_COLUMNS,
            (columns: AnyColumn<TOriginalRow>[]) => {
                const flattenedColumns = flattenColumnStructureAndClearGroups([...columns]);
                const transformedColumns = transformColumns([...flattenedColumns]);
                const hierarchicalColumns = columnProcessor.createColumnHierarchy(transformedColumns);
                return hierarchicalColumns;
            }
        );
        super(config);

        // Initialize Extra with `config.extra`
        this.extra = new Extra(this, config.extra);
    }

    isFullscreenEnabled() {
        return this.extra.features.fullscreen.isFullscreen;
    }
}


export class ExtraState {
    highlightSelectedRow = $state(true)
    showCredentials = $state(true)
    withPagination = $state(true)
    enableRowSelection = $state(true)

}

export class Extra {
    private datagrid: TzezarsDatagrid<any>;
    title: string | undefined;
    state = new ExtraState();
    features = {
        fullscreen: new FullscreenFeature(),
        groupHeadersVisibility: new GroupHeadersVisibilityFeature(),
        columnFiltering: new ColumnFilteringFeature(),
        exporting: {} as ExportingFeature<any>
    };

    constructor(datagrid: TzezarsDatagrid<any>, config?: TzezarsDatagridExtraStateConfig) {
        this.datagrid = datagrid;
        this.features.exporting = new ExportingFeature(datagrid);
        this.title = config?.title; // Assign the title from config.extra
        this.state.highlightSelectedRow = config?.state?.highlightSelectedRow ?? this.state.highlightSelectedRow;
        this.state.showCredentials = config?.state?.showCredentials ?? this.state.showCredentials;
        this.state.withPagination = config?.state?.withPagination ?? this.state.withPagination
    }

    getTitle(): string | undefined {
        return this.title; // Getter for consistent access
    }
    showCredentials(): boolean {
        return this.state.showCredentials;
    }
}
