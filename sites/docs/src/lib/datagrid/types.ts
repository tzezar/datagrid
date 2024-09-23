


export type Data<T> = T[];
export type WithIdentifier = { id: number };

export type ColumnId<T = unknown> = keyof T | (string & {});
export type BaseColumn<T = unknown> = {
    id: ColumnId<T>;
    title: string;
    width?: string;
    filterType?: FilterType;
    filterValue?: FilterValue;
    options?: { value: string; label: string }[];
    sortable?: boolean;
    visible?: boolean;
    resizable?: boolean;
    moveable?: boolean;
    pinnable?: boolean;
    hideable?: boolean;
    exportable?: boolean;
    selectable?: boolean;
    grow?: boolean;
    pinned?: {
        position: 'left' | 'right';
        offset?: string | null;
    };
    align?: 'start' | 'center' | 'end';
};





export type ExpandedRows = (number | string)[];
export type Sorting = {
    columnId: ColumnId;
    direction: string;
}



export type Page = number
export type PerPage = number
export type Count = number

export type Pagination = {
    page: Page,
    perPage: PerPage,
    count: Count
}

export type Filter = {
    columnId: ColumnId;
    value: FilterValue;
    type: FilterType;
};
export type FilterValue = string | number | [number, number] | [string, string];
export type FilterType = 'string' | 'number' | 'range' | 'date' | 'dateRange' | 'select';





export type SelectionRange = Set<string>;
export type SelectionPoint = {
    rowIndex: number; columnIndex: number
} | null



export type SelectionState = {
    start: SelectionPoint;
    end: SelectionPoint;
    range: SelectionRange;
    activeRange: SelectionRange;
    isSelecting: boolean;
    isRemoving: boolean;
    isMouseDown: boolean;

}

