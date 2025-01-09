import type { DataGrid } from "../index.svelte";
import type { SortConfig } from "../types";

export class SortingFeature {
    datagrid: DataGrid<any>;
    sortConfigs: SortConfig[] = $state([]);

    constructor(datagrid: DataGrid<any>) {
        this.datagrid = datagrid;
    }


    refreshIndices() {
        this.sortConfigs = this.sortConfigs
            .map((config, i) => ({ ...config, index: i }));
    }

    clearSorting() {
        this.sortConfigs = [];
    }

    removeSortConfig(columnId: string) {
        this.sortConfigs = this.sortConfigs.filter((config) => config.columnId !== columnId);
        this.refreshIndices()
    }

    findIndex(columnId: string) {
        return this.sortConfigs.findIndex((config) => config.columnId === columnId);
    }

    changeDirection(columnId: string, desc: boolean) {
        const index = this.findIndex(columnId);
        this.sortConfigs = this.sortConfigs.map((config, i) =>
            i === index ? { ...config, desc } : config
        );
    }

    addSortConfig(columnId: string, desc: boolean) {
        this.sortConfigs = [...this.sortConfigs, { columnId, desc, index: this.sortConfigs.length }];
    }

    isColumnSorted(columnId: string, desc?: boolean) {
        if (desc === undefined) return this.sortConfigs.some((config) => config.columnId === columnId);
        return this.sortConfigs.some((config) => config.columnId === columnId && config.desc === desc);
    }

}