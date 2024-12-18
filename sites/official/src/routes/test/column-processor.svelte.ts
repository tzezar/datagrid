import type { AnyColumn } from "./datagrid/core/helpers/column-creators";

function createValueGetter<TData>(column: AnyColumn<TData>): (row: TData) => any {
    // Prioritize methods in this order:
    // if (column.getValue) return column.getValue;
    if (column.accessorFn) return column.accessorFn;
    if (column.accessorKey) {
        // Optimized nested property access
        const parts = column.accessorKey.split('.');
        return (row) => {
            let value = row;
            for (const part of parts) {
                value = value?.[part];
                if (value === undefined) return undefined;
            }
            return value;
        };
    }
    
    // Fallback
    return () => undefined;
}