


export interface ColumnDef {
    accessorKey?: string;
    accessorFn?: (row: any) => any;
    formatter?: (row: any) => any;
    header: string;


    size?: {
        width: number;
        minWidth: number;
        maxWidth: number;
    }

    visible?: boolean;
    groupable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    cell?: {
        component?: any;
        style?: (row: any) => any;
    }
}

export interface Data<T = any> {
    [key: string]: T;
}