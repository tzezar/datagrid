


export interface ColumnDef {
    accessorKey: string;
    header: string;
}

export interface Data<T = any> {
    [key: string]: T;
}
