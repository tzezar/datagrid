import type { Datagrid } from "../index.svelte";
import type { DatagridPlugin } from "../types";

export class PluginManager<TData, TCustomKeys extends string = never> {
    private plugins: Map<string, DatagridPlugin<TData>> = new Map();
    private datagrid: Datagrid<TData, TCustomKeys>;

    constructor(datagrid: Datagrid<TData, TCustomKeys>) {
        this.datagrid = datagrid;
    }

    register(plugin: DatagridPlugin<TData, TCustomKeys>): void {
        if (this.plugins.has(plugin.name)) {
            console.warn(`Plugin ${plugin.name} is already registered. It will be overwritten.`);
        }
        this.plugins.set(plugin.name, plugin);
        plugin.initialize?.(this.datagrid);
    }

    get<T extends DatagridPlugin<TData>>(name: string): T | undefined {
        return this.plugins.get(name) as T;
    }

    has(name: string): boolean {
        return this.plugins.has(name);
    }

    destroy(): void {
        this.plugins.forEach(plugin => plugin.destroy?.());
        this.plugins.clear();
    }
}