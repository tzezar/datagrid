


export interface ColumnDef {
    accessorKey?: string;
    accessorFn?: (row: any) => any;
    header: string;
}

export interface Data<T = any> {
    [key: string]: T;
}
