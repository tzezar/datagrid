export const code = {
    columns: `import type { BaseColumn } from "$lib/datagrid/types";
    
type InventoryDataRow = {
    product: {
        name: string;
    };
    price: number;
}

export const columns = [
    {
        id: 'product.name',
        title: 'Product name',
        grow: true,
    },
    {
        id: 'price',
        title: 'Price',
    },
] satisfies BaseColumn<InventoryDataRow>[]`,
    baseColumns: `// to make nested column ids work, this has be changed for sure
export type ColumnId<T = unknown> = keyof T | (string & {});

export type BaseColumn<T = unknown> = {
    // has to be unique
    id: ColumnId<T>;
    // used in various places like header
    title: string;
    // starting width of column
    width?: string;
    // filter type for this columns eg. string, number, date etc.
    filterType?: FilterType;
    // default filter value
    filterValue?: FilterValue;
    // options used in select filter
    options?: { value: string; label: string }[];
    // definies if column is sortable
    sortable?: boolean;
    // definies if column is visible by default
    visible?: boolean;
    // definies if column is resizable
    resizable?: boolean;
    // definies if column is moveable
    moveable?: boolean;
    // definies if column is pinnable
    pinnable?: boolean;
    // definies if column is hideable
    hideable?: boolean;
    // definies if column is exportable eg. in excel export
    exportable?: boolean;
    // definies if column is selectable
    selectable?: boolean;
    // this basically makes add flex-grow: 1; to column, can give nice results when used eg. on most important column, columns in the middle or last column
    // I suggest adding it to one column at least
    grow?: boolean;
    // options for pinned columns, offset is in px and is recalculated based on other columns automatically
    // (optional) you can pass starting offset eg. '100px' that will be the same as width of column 
    pinned?: {
        position: 'left' | 'right';
        offset?: string | null;
    };
    // self explanatory, you can override default align passing styles to cells
    align?: 'start' | 'center' | 'end';
};`,
    important1: `satisfies BaseColumn<InventoryDataRow>[]`
}