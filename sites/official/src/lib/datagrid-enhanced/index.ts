import { TzezarsDatagrid } from './core/index.svelte';
import type { ColumnMetaEnhanced } from './core/types';
import DatagridEnhanced from './datagrid-enhanced.svelte';

export {
    TzezarsDatagrid as DatagridEnhanced,
    DatagridEnhanced as Datagrid
};

export type { ColumnMetaEnhanced as EnhancedColumnMeta };