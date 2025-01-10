

type ColumnIdFromOriginaLData<T> = keyof T
export type ColumnId<T> = ColumnIdFromOriginaLData<T> | (string & {});


type AccessorColumn<T> = {
    columnId: ColumnId<T>
}

type GroupColumn<T> = {
    columnId: ColumnId<T>
    columns: Column<T>[]
}

type ComputedColumn<T> = {
    columnId: ColumnId<T>
}

type DisplayColumn<T> = {
    columnId: ColumnId<T>
}

type Column<T> = AccessorColumn<T> | GroupColumn<T> | ComputedColumn<T> | DisplayColumn<T>;


const generateId = (): string => Math.random().toString(36).substring(2, 15);


const columns = [
    {
        columnId: 'abc',
    },
    {
        columnId: generateId() as string,
    },
] satisfies Column<User>[]


export interface User {
    id: number;
    firstName: string;
    lastName: string;
    profile: {
        age: number;
        email: string;
        country: string;
    };
    stats: {
        visits: number;
        lastLogin: Date;
        averageSessionDuration: number; // in minutes
    };
    status: 'active' | 'inactive' | 'pending';
    role: 'admin' | 'user' | 'guest';
}

const data: User[] = []

class Datagrid<T, C extends Column<C>> {
    data: T[] = [];
    columns: C[] = [];

    constructor(data: T[], columns: C[]) {
        this.data = data;
        this.columns = columns;
    }
}



const datagrid = new Datagrid(data, columns);

const col = datagrid.columns[0]
if (col.columnId === '') {}