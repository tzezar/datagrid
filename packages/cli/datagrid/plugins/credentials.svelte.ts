export type CredentialsPluginConfig = {
    displayCredentials?: boolean;
    onCredentialsChange?(credentials: CredentialsPluginConfig): void;
}

export class CredentialsPlugin {
    enabled: boolean = $state(true);

    constructor(config?: CredentialsPluginConfig) {
        this.enabled = config?.displayCredentials ?? this.enabled;
    }


}