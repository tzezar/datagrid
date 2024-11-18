import type { BaseColumn } from "$lib/tzezars-datagrid/types";
import type { DataRow } from "$lib/generateData";

// export type DataRow = {
//     date: string;
// }

// type ColumnId<T> = keyof T | (string & {});
// type BaseColumn<T> = {
//     id: ColumnId<T>;
//     title: string;
// }

// const columns2 = [
//     {
//         id: 'checkbox',
//         title: 'Id',
//     },
//     {
//         id: 'date',
//         title: 'ID',
//     },
// ] satisfies BaseColumn<DataRow>[]

// class TestClass<T, C extends BaseColumn<T> = BaseColumn<T>> {
//     data: T[] = []
//     columns: C[] = []

//     constructor(data: T[], columns: C[]) {
//         this.data = data;
//         this.columns = columns;
//     }
// }

// const test = new TestClass([], columns2);

// for (const column of test.columns) {
//     // just data types showing, no custom checkbox type checking
//     if (column.id === '') {
//         console.log('This is a checkbox column');
//     } else {
//         console.log(`This is a ${column.id} column`);
//     }
// }


export const columns = [
    {
        id: 'checkbox',
        title: 'Row selection',
        width: '50px',
        pinned: {
            position: 'left'
        },
        visible: true,
        resizable: false,
        sortable: false,
        exportable: false,
        selectable: false
    },

    {
        id: 'expand',
        title: 'Row expand',
        width: '50px',
        pinnable: true,
        pinned: {
            position: 'left'
        },
        visible: true,
        resizable: false,
        sortable: false,
        exportable: false,
        selectable: false
    },
    {
        id: 'id',
        title: 'Id',
        width: '100px',
        filterType: 'number',
        filterValue: '',
        sortable: true,
        visible: true,
    },
    {
        id: 'title',
        title: 'Number',
        width: '200px',
        filterType: 'string',
        filterValue: '',
        sortable: true,
        visible: true,
    },
    {
        id: 'receiver',
        title: 'Client name',
        width: '200px',
        filterType: 'string',
        filterValue: '',
        sortable: true,
        visible: true,
        grow: true

    },
    {
        id: 'date',
        title: 'Date',
        width: '150px',
        filterType: 'date',
        filterValue: '',
        sortable: true,
        visible: true,
        moveable: false,
    },
    {
        id: 'status',
        title: 'Status',
        filterType: 'select',
        width: '150px',
        filterValue: '',
        options: [
            { label: 'Everything', value: '' },
            { label: 'Draft', value: 'draft' },
            { label: 'Entered', value: 'entered' },
            { label: 'Canceled', value: 'canceled' }
        ],
        sortable: true,
        visible: true,
    },
    {
        id: 'total',
        title: 'Gross Total',
        filterType: 'range',
        width: '100px',
        filterValue: [0, 9999999999],
        visible: true,
        sortable: true,
        hideable: false,
        align: 'end',
    },
    {
        id: 'netTotal',
        title: 'Net Total',
        filterType: 'range',
        width: '100px',
        filterValue: [0, 9999999999],
        visible: true,
        sortable: true,
        hideable: false,
        align: 'end',
    },
    {
        id: 'tax',
        title: 'Tax Total',
        filterType: 'range',
        width: '100px',
        filterValue: [0, 9999999999],
        visible: true,
        sortable: true,
        hideable: false,
        align: 'end',
    },
    {
        id: 'profit',
        title: 'Profit',
        filterType: 'range',
        width: '100px',
        filterValue: [0, 9999999999],
        visible: true,
        sortable: true,
        hideable: false,
        align: 'end',
    },
    {
        id: 'deliveredBy',
        title: 'Delivered by',
        width: '150px',
        filterType: 'string',
        filterValue: '',
        sortable: true,
        visible: true,
    },
    {
        id: 'actions',
        title: 'Actions',
        visible: true,
        width: '130px',
        resizable: false,
        sortable: false,
        exportable: false,
        selectable: false,
        hideable: false,
        pinned: {
            position: 'right'
        },
        align: 'center'
    }
] satisfies BaseColumn<DataRow>[]
