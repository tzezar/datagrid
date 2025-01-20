import { ColumnOrderingFeature } from "$lib/datagrid/core/features";
import type { DataGrid } from "$lib/datagrid/core/index.svelte";

export type ExtraColumnOrderingFeatureConfig = {
    enableColumnOrdering?: boolean;
}


export class ExtraColumnOrderingFeature {
    base: ColumnOrderingFeature<any> = new ColumnOrderingFeature({} as DataGrid<any>);
    enableColumnOrdering: boolean = $state(true);

    constructor(datagrid: DataGrid<any>, config?: ExtraColumnOrderingFeatureConfig) {
        this.base = datagrid.features.columnOrdering;
        this.base.initialize(config);

        this.initialize(config);
    }

    initialize(config?: ExtraColumnOrderingFeatureConfig) {
        this.enableColumnOrdering = config?.enableColumnOrdering ?? this.enableColumnOrdering;
    }


}