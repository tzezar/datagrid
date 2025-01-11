import { isGroupColumn } from "../helpers/column-guards";
import type { AnyColumn, GroupColumn } from "../column-creation/types";
import type { DataGrid } from "../index.svelte";
import type { LeafColumn } from "../types";
import { findColumnById, flattenColumns, flattenColumnsWithNestedColumns } from "../utils.svelte";



export class ColumnManager<TOriginalRow> {
    datagrid: DataGrid<TOriginalRow>;
    constructor(datagrid: DataGrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }



    getGroupColumns(): GroupColumn<TOriginalRow>[] {
        return flattenColumns(this.datagrid.columns).filter(col => isGroupColumn(col));
    }

    getFlatColumns(): AnyColumn<TOriginalRow>[] {
        const flattened: AnyColumn<any>[] = [];
        for (const column of this.datagrid.columns) {
            if (isGroupColumn(column)) {
                flattened.push(column);
                flattened.push(...flattenColumns(column.columns));
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
                flattened.push(...flattenColumnsWithNestedColumns(column.columns));
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
        return flattenColumns(this.getColumnsInOrder()).filter(col => col.type !== 'group')
    }


    getColumnWithGroupStructureAbove(
        columnId: string,
    ): AnyColumn<TOriginalRow> | null {
        const column = findColumnById(this.datagrid.columns, columnId) as AnyColumn<TOriginalRow>;
        if (!column) {
            throw new Error(`Column ${columnId} not found`);
        }

        if (column.parentColumnId === null) {
            return column
        }

        const buildGroupHierarchy = (
            currentColumn: AnyColumn<TOriginalRow>
        ): GroupColumn<TOriginalRow> | null => {
            if (currentColumn.parentColumnId === null) {
                return null;
            }

            const parentGroup = this.datagrid.features.columnGrouping.findParentColumnGroup(currentColumn.parentColumnId);
            if (!parentGroup) {
                return null;
            }

            const upperGroup = buildGroupHierarchy(parentGroup);
            const currentGroup = {
                ...parentGroup,
                columns: [currentColumn]
            };

            if (upperGroup) {
                upperGroup.columns = [currentGroup];
                return upperGroup;
            }

            return currentGroup;
        };

        return buildGroupHierarchy(column);
    }



    getColumnsPinnedToLeft(): AnyColumn<TOriginalRow>[] {
        return flattenColumns(this.datagrid.columns).filter(col => col.state.pinning.position === 'left' || this.datagrid.features.grouping.groupByColumns.includes(col.columnId))
    }
    getColumnsPinnedToRight(): AnyColumn<TOriginalRow>[] {
        return flattenColumns(this.datagrid.columns).filter(col => col.type !== 'group').filter(col => col.state.pinning.position === 'right')
    }
    getColumnsPinnedToNone(): AnyColumn<TOriginalRow>[] {
        // return this.datagrid.columnManager.getLeafColumns().filter(col => col.state.pinning.position === 'none').filter(col => !this.datagrid.features.grouping.groupByColumns.includes(col.columnId))
        return flattenColumns(this.datagrid.columns).filter(col =>  col.state.pinning.position === 'none' && !this.datagrid.features.grouping.groupByColumns.includes(col.columnId))
    }


    getColumnsInOrder(): AnyColumn<TOriginalRow>[] {
        // const cols = [...this.getColumnsPinnedToLeft(), ...this.datagrid.processors.column.createColumnHierarchy(this.getColumnsPinnedToNone()), ...this.datagrid.processors.column.createColumnHierarchy(this.getColumnsPinnedToRight())]
        const pinnedLeft = this.getColumnsPinnedToLeft()
        const pinnedNone = this.getColumnsPinnedToNone()
        const pinnedRight = this.getColumnsPinnedToRight()
        return [...pinnedLeft, ...this.datagrid.processors.column.createColumnHierarchy(pinnedNone), ...this.datagrid.processors.column.createColumnHierarchy(pinnedRight)]
    }



}