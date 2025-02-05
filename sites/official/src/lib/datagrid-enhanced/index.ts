import { EnhancedDatagrid } from './core/index.svelte';
import type { ColumnMetaEnhanced } from './core/types';
import MainComponent from './main-component.svelte';

export {
    EnhancedDatagrid as EnhancedCore,
    MainComponent as Component,
}

export type {
    ColumnMetaEnhanced as EnhancedMeta
}