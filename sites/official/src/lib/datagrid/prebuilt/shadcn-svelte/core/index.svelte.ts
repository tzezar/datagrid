import type { AnyColumn, GroupColumn } from "$lib/datagrid/core/column-creation/types";
import { DataGrid, type GridConfig } from "$lib/datagrid/core/index.svelte";
import { LifecycleHooks } from "$lib/datagrid/core/managers/lifecycle-hooks-manager.svelte";
import { ColumnProcessor } from "$lib/datagrid/core/processors";
import { flattenColumns } from "$lib/datagrid/core/utils.svelte";
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
                showColumnManagerDropdownMenu: col._meta.showColumnManagerDropdownMenu ?? true,
            }
        }
    })
    return newCols
}

const deepCopyColumn = (column: AnyColumn<TOriginalRow>): AnyColumn<TOriginalRow> => {
    const copy = {
        ...column,
        _meta: { ...column._meta }  // Explicitly copy _meta object
    };
    
    if (copy.type === 'group' && copy.columns) {
        copy.columns = copy.columns.map(col => deepCopyColumn(col));
    }
    return copy;
};


function createHierarchicalColumns<TOriginalRow>(columnToBuildHierarchy: AnyColumn<TOriginalRow>[], allFlatColumns: AnyColumn<TOriginalRow>[]): AnyColumn<TOriginalRow>[] {
    // Helper function to find a column by ID in a hierarchical structure
    const findColumnById = (
        columnId: string,
        columns: AnyColumn<TOriginalRow>[]
    ): AnyColumn<TOriginalRow> | null => {
        for (const col of columns) {
            if (col.columnId === columnId) return col;
            if (col.type === 'group' && col.columns) {
                const found = findColumnById(columnId, col.columns);
                if (found) return found;
            }
        }
        return null;
    };

    // Helper function to merge two group columns with proper _meta handling
    const mergeGroupColumns = (
        existing: GroupColumn<TOriginalRow>,
        incoming: GroupColumn<TOriginalRow>
    ) => {
        existing.columns = existing.columns || [];
        if (incoming.columns) {
            for (const incomingChild of incoming.columns) {
                const existingChild = findColumnById(incomingChild.columnId, existing.columns);
                if (!existingChild) {
                    existing.columns.push(deepCopyColumn(incomingChild));
                } else if (existingChild.type === 'group' && incomingChild.type === 'group') {
                    // Preserve _meta when merging
                    existingChild._meta = { ...existingChild._meta, ...incomingChild._meta };
                    mergeGroupColumns(existingChild, incomingChild);
                }
            }
        }
    };

    // Build the complete hierarchy for a column
    const buildCompleteHierarchy = (
        column: AnyColumn<TOriginalRow>,
        processed: Set<string>
    ): AnyColumn<TOriginalRow> => {
        if (processed.has(column.columnId)) {
            return deepCopyColumn(column);
        }

        processed.add(column.columnId);
        const currentColumn = deepCopyColumn(column);

        if (currentColumn.parentColumnId) {
            const parentColumn = allFlatColumns.find(
                col => col.columnId === currentColumn.parentColumnId
            );

            if (!parentColumn) {
                throw new Error(`Parent column ${currentColumn.parentColumnId} not found`);
            }

            const parent = deepCopyColumn(parentColumn) as GroupColumn<TOriginalRow>;
            parent.columns = [currentColumn];
            return buildCompleteHierarchy(parent, processed);
        }

        return currentColumn;
    };

    // Process columns and build final hierarchy
    const result: AnyColumn<TOriginalRow>[] = [];
    const processedColumns = new Set<string>();

    // First pass: build initial hierarchies
    for (const column of columnToBuildHierarchy) {
        if (!processedColumns.has(column.columnId)) {
            const hierarchy = buildCompleteHierarchy(column, new Set());

            // Check if we already have this root in our result
            const existingRoot = result.find(col => col.columnId === hierarchy.columnId);

            if (existingRoot) {
                // Merge the hierarchies with proper _meta handling
                if (existingRoot.type === 'group' && hierarchy.type === 'group') {
                    existingRoot._meta = { ...existingRoot._meta, ...hierarchy._meta };
                    mergeGroupColumns(existingRoot, hierarchy);
                }
            } else {
                result.push(hierarchy);
            }

            processedColumns.add(column.columnId);
        }
    }

    return result;
}

export class TzezarsDatagrid<TOriginalRow = any> extends DataGrid<TOriginalRow> {
    constructor(config: TzezarsDatagridConfig<TOriginalRow>) {
        // config.lifecycleHooks = new LifecycleHooks<TOriginalRow>();
        // config.lifecycleHooks.register(LifecycleHooks.HOOKS.PRE_PROCESS_COLUMNS, (columns: AnyColumn<TOriginalRow>[]) => {
        //     console.log('columns passed to pre process', columns);
        //     const flattenedColumns = flattenColumns([...columns]);
        //     const transformedColumns = transformColumns([...flattenedColumns]);
        //     console.log('transformed columns', transformedColumns);
        //     const hierarchicalColumns = createHierarchicalColumns(transformedColumns, flattenedColumns);
        //     console.log('hierarchical columns', hierarchicalColumns);
        //     return hierarchicalColumns
        // });
        super(config);
    }
    extra = new Extra();
}

export class ExtraState {
    highlightSelectedRow = $state(true)
}

export class Extra {
    features = {
        fullscreen: new FullscreenFeature(),
        groupHeadersVisibility: new GroupHeadersVisibilityFeature()
    }

}