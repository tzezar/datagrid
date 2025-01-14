import type { AnyColumn, GroupColumn } from "$lib/datagrid/core/column-creation/types";
import { DataGrid, type GridConfig } from "$lib/datagrid/core/index.svelte";
import { LifecycleHooks } from "$lib/datagrid/core/managers/lifecycle-hooks-manager.svelte";
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
                showColumnManagerDropdownMenu: true
            }
        }
    })
    return newCols
}

function createColumnHierarchy<TOriginalRow>(flatColumns: AnyColumn<TOriginalRow>[]): AnyColumn<TOriginalRow>[] {
    // Hierarchy can be multiple levels deep, so we need to traverse the hierarchy and build the final result

    const results: AnyColumn<TOriginalRow>[] = [];
    const pendingColumns: AnyColumn<TOriginalRow>[] = [...flatColumns];

    const findParentColumnInResults = (columns: AnyColumn<TOriginalRow>[], column: AnyColumn<TOriginalRow>): AnyColumn<TOriginalRow> | null => {
        for (const col of columns) {
            if (col.columnId === column.parentColumnId) return col;
            if (col.type === 'group' && col.columns) {
                const found = findParentColumnInResults(col.columns, column);
                if (found) return found;
            }
        }
        return null;
    };

    let index = 0

    while (pendingColumns.length > 0) {
        index++
        if (index > 1000) throw new Error('Infinite loop detected in createColumnHierarchy');
        const column = pendingColumns.shift()!;

        if (column.parentColumnId === null) {
            results.push(column);
            continue;
        }
        let parentColumn = findParentColumnInResults(results, column);
        if (parentColumn === null) {
            // Check next column
            pendingColumns.push(column);
            continue;
        } else {
            parentColumn = parentColumn as GroupColumn<TOriginalRow>;
            parentColumn.columns.push(column);
        }
    }


    return results
}

function flattenColumns(columns: AnyColumn<any>[]): AnyColumn<any>[] {
    const flattened: AnyColumn<any>[] = [];

    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.type === 'group') {
            flattened.push(...flattenColumns(column.columns));
            flattened.push({ ...column, columns: [] });
        }
        else {
            flattened.push(column);
        }
    }
    return flattened;
}


export class TzezarsDatagrid<TOriginalRow = any> extends DataGrid<TOriginalRow> {
    constructor(config: TzezarsDatagridConfig<TOriginalRow>) {
        config.lifecycleHooks = new LifecycleHooks<TOriginalRow>();
        config.lifecycleHooks.register(LifecycleHooks.HOOKS.PRE_PROCESS_COLUMNS, (columns: AnyColumn<TOriginalRow>[]) => {
            const flattenedColumns = flattenColumns([...columns]);
            const transformedColumns = transformColumns([...flattenedColumns]);
            const hierarchicalColumns = createColumnHierarchy(transformedColumns);
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