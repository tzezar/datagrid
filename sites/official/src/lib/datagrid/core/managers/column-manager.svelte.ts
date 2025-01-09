import { isGroupColumn } from "../helpers/column-guards";
import type { AnyColumn, GroupColumn } from "../column-creation/types";
import type { Datagrid } from "../index.svelte";
import type { LeafColumn } from "../types";
import { findColumnById, flattenColumns } from "../utils.svelte";



export class ColumnManager<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;
    constructor(datagrid: Datagrid<TOriginalRow>) {
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

            const parentGroup = this.datagrid.columnGrouping.findParentColumnGroup(currentColumn.parentColumnId);
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
        // return this.datagrid.columnManager.getLeafColumns().filter(col => col.state.pinning.position === 'left' || this.datagrid.grouping.groupByColumns.includes(col.columnId))
        // return this.datagrid.columnManager.getLeafColumns().filter(col => col.state.pinning.position === 'left')
        return flattenColumns(this.datagrid.columns).filter(col => col.state.pinning.position === 'left' || this.datagrid.grouping.groupByColumns.includes(col.columnId))
    }
    getColumnsPinnedToRight(): AnyColumn<TOriginalRow>[] {
        return this.datagrid.columnManager.getLeafColumns().filter(col => col.state.pinning.position === 'right')
    }
    getColumnsPinnedToNone(): AnyColumn<TOriginalRow>[] {
        return this.datagrid.columnManager.getLeafColumns().filter(col => col.state.pinning.position === 'none').filter(col => !this.datagrid.grouping.groupByColumns.includes(col.columnId))
    }


    getColumnsInOrder(): AnyColumn<TOriginalRow>[] {
        const cols = [...this.getColumnsPinnedToLeft(), ...this.datagrid.processors.column.createHierarchicalColumns(this.getColumnsPinnedToNone()), ...this.datagrid.processors.column.createHierarchicalColumns(this.getColumnsPinnedToRight())]
        return cols
    }



}