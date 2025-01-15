import { isGroupColumn } from "../helpers/column-guards";
import type { AnyColumn, GroupColumn } from "../types";
import type { DataGrid } from "../index.svelte";
import type { LeafColumn } from "../types";
import { flattenColumnStructureAndClearGroups, flattenColumnStructurePreservingGroups } from "../utils.svelte";



export class ColumnManager<TOriginalRow> {
    datagrid: DataGrid<TOriginalRow>;
    constructor(datagrid: DataGrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    getGroupColumns(columns: AnyColumn<TOriginalRow>[] = this.datagrid.columns): GroupColumn<TOriginalRow>[] {
        return flattenColumnStructureAndClearGroups(columns).filter(col => isGroupColumn(col));
    }

    getFlatColumns(): AnyColumn<TOriginalRow>[] {
        const flattened: AnyColumn<any>[] = [];
        for (const column of this.datagrid.columns) {
            if (isGroupColumn(column)) {
                flattened.push(column);
                flattened.push(...flattenColumnStructureAndClearGroups(column.columns));
            } else {
                flattened.push(column);
            }
        }
        return flattened;
    }

    getFlatColumnsWithNestedColumns(): AnyColumn<TOriginalRow>[] {
        const flattened: AnyColumn<any>[] = [];
        for (const column of this.datagrid.columns) {
            if (isGroupColumn(column)) {
                flattened.push(column);
                flattened.push(...flattenColumnStructurePreservingGroups(column.columns));
            } else {
                flattened.push(column);
            }
        }
        return flattened;
    }

    getLeafColumns(): LeafColumn<TOriginalRow>[] {
        return this.getFlatColumns().filter(col => col.type !== 'group')
    }

    getLeafColumnsInOrder(): LeafColumn<TOriginalRow>[] {
        // let timeStart = performance.now();
        const cols = flattenColumnStructureAndClearGroups(this.getColumnsInOrder()).filter(col => col.type !== 'group')
        // console.log(`getLeafColumnsInOrder took ${performance.now() - timeStart}ms`)
        return cols
    }

    getColumnsInOrder(): AnyColumn<TOriginalRow>[] {
        const getColumnsPinnedToLeft = (): AnyColumn<TOriginalRow>[] => {
            return flattenColumnStructureAndClearGroups(this.datagrid.columns).filter(col => col.state.pinning.position === 'left' || this.datagrid.features.grouping.groupByColumns.includes(col.columnId))
        }
        const getColumnsPinnedToRight = (): AnyColumn<TOriginalRow>[] => {
            return flattenColumnStructureAndClearGroups(this.datagrid.columns).filter(col => col.type !== 'group').filter(col => col.state.pinning.position === 'right')
        }
        const getColumnsPinnedToNone = (): AnyColumn<TOriginalRow>[] => {
            // return this.datagrid.columnManager.getLeafColumns().filter(col => col.state.pinning.position === 'none').filter(col => !this.datagrid.features.grouping.groupByColumns.includes(col.columnId))
            return flattenColumnStructureAndClearGroups(this.datagrid.columns).filter(col =>  col.state.pinning.position === 'none' && !this.datagrid.features.grouping.groupByColumns.includes(col.columnId))
        }
        
        const pinnedLeft = getColumnsPinnedToLeft()
        const pinnedNone = getColumnsPinnedToNone()
        const pinnedRight = getColumnsPinnedToRight()
        return [...pinnedLeft, ...this.datagrid.processors.column.createColumnHierarchy(pinnedNone), ...pinnedRight]
    }


}