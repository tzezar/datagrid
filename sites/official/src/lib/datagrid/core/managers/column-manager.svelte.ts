import { isGroupColumn } from "../column-guards";
import type { AccessorColumn, AnyColumn, ComputedColumn, DisplayColumn, GroupColumn } from "../helpers/column-creators";
import type { Datagrid } from "../index.svelte";
import { filterGroupColumns, findColumnById, flattenColumns } from "../utils.svelte";



export class ColumnManager<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;
    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    getGroupColumns(): GroupColumn<TOriginalRow>[] {
        return filterGroupColumns(flattenColumns(this.datagrid.columns));
    }

    getFlattenColumns(): AnyColumn<TOriginalRow>[] {
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

    getActualColumns(): (AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow> | DisplayColumn<TOriginalRow>)[] {
        return this.getFlattenColumns().filter(col => col.type !== 'group')
    }

    getColumnWithGroupStructureAbove<TOriginalRow>(
        columnId: string,
    ): GroupColumn<TOriginalRow> | null {
        const column = findColumnById(this.datagrid.columns, columnId);
        if (!column) {
            throw new Error(`Column ${columnId} not found`);
        }

        if (column.parentColumnId === null) {
            return column
        }

        const buildGroupHierarchy = (
            currentColumn: AnyColumn<any> | GroupColumn<TOriginalRow>
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
        return this.datagrid.columnManager.getFlattenColumns().filter(col => col.state.pinning.position === 'left')
    }
    getColumnsPinnedToRight(): AnyColumn<TOriginalRow>[] {
        return this.datagrid.columnManager.getFlattenColumns().filter(col => col.state.pinning.position === 'right')  
    }
    getColumnsPinnedToNone(): AnyColumn<TOriginalRow>[] {
        return this.datagrid.columnManager.getFlattenColumns().filter(col => col.state.pinning.position === 'none')  
    }
    getColumnsInOrder(): AnyColumn<TOriginalRow>[] {
        return [...this.getColumnsPinnedToLeft(), ...this.getColumnsPinnedToNone(), ...this.getColumnsPinnedToRight()]
    }
}