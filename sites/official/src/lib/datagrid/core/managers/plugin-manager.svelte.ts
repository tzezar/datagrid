import type { DatagridCore } from "../index.svelte";

export type DatagridPlugin<T> = {
    name: string;
    initialize: (datagrid: DatagridCore) => T;
}

export class PluginManager {
    datagrid: DatagridCore
    private plugins: Map<string, any> = new Map();

    constructor(datagrid: DatagridCore) {
        this.datagrid = datagrid
    }

    registerPlugin<T>(plugin: DatagridPlugin<T>): void {
        if (this.plugins.has(plugin.name)) {
            throw new Error(`Plugin ${plugin.name} is already registered.`);
        }
        const pluginInstance = plugin.initialize(this.datagrid);
        this.plugins.set(plugin.name, pluginInstance);
    }

    getPlugin<T>(name: string): T | undefined {
        return this.plugins.get(name);
    }

    removePlugin(name: string): void {
        if (this.plugins.has(name)) {
            this.plugins.delete(name);
        } else {
            throw new Error(`Plugin ${name} not found.`);
        }
    }
}
