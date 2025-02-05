import type { TzezarsDatagrid } from "../index.svelte";
import type { Feature } from "./types";

export type CredentialsFeatureConfig = {
    displayCredentials?: boolean;
    onCredentialsChange?(credentials: CredentialsFeatureConfig): void;
}

export class CredentialsFeature implements Feature {
    datagrid: TzezarsDatagrid
    enabled: boolean = $state(true);

    onCredentialsChange: (credentials: CredentialsFeatureConfig) => void = () => { };

    constructor(datagrid: TzezarsDatagrid, config?: CredentialsFeatureConfig) {
        this.datagrid = datagrid;
        this.initialize(config);
    }

    initialize(config?: CredentialsFeatureConfig) {
        this.enabled = config?.displayCredentials ?? this.enabled;
        this.onCredentialsChange = config?.onCredentialsChange ?? this.onCredentialsChange;
    }


}