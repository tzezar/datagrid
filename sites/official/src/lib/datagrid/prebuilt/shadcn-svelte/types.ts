export type ColumnMeta = {
    align?: 'start' | 'center' | 'end';
    // filterType?: 'text' | 'number' | 'select' | 'date' | 'dateRange' | 'range';
    filterType?: 'text' | 'number' | 'select'
    filterOptions?: { label: string, value: string }[];
    showColumnManagerDropdownMenu?: boolean;
}