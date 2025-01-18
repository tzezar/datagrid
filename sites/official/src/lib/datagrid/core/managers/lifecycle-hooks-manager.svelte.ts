import type { AnyColumn } from "../types";

export type HookFunction<T = any> = (...args: any[]) => T;

export class LifecycleHooks<TRow> {
    private hooks: Map<string, HookFunction[]> = new Map();

    // Predefined hook names to avoid typos and provide better TypeScript support
    static readonly HOOKS = {
        PRE_PROCESS_ORIGINAL_COLUMNS: 'preProcessOriginalColumns', // works on original columns
        POST_PROCESS_ORIGINAL_COLUMNS: 'postProcessOriginalColumns', // works on original columns
        PRE_PROCESS_COLUMNS: 'preProcessColumns',
        POST_PROCESS_COLUMNS: 'postProcessColumns',
        PRE_PROCESS_DATA: 'preProcessData',
        POST_PROCESS_DATA: 'postProcessData',
        PRE_SORT: 'preSort',
        POST_SORT: 'postSort',
        PRE_GLOBAL_SEARCH: 'preGlobalSearch',
        POST_GLOBAL_SEARCH: 'postGlobalSearch',
        PRE_FILTER: 'preFilter',
        POST_FILTER: 'postFilter',
    } as const;

    constructor() {
        // Initialize all hook arrays
        Object.values(LifecycleHooks.HOOKS).forEach(hookName => {
            this.hooks.set(hookName, []);
        });
    }

    /**
     * Register a new hook function for a specific lifecycle event
     */
    register(hookName: string, fn: HookFunction) {
        if (!this.hooks.has(hookName)) {
            throw new Error(`Invalid hook name: ${hookName}`);
        }
        this.hooks.get(hookName)!.push(fn);
    }

    /**
     * Remove a hook function
     */
    unregister(hookName: string, fn: HookFunction) {
        if (!this.hooks.has(hookName)) {
            throw new Error(`Invalid hook name: ${hookName}`);
        }
        const hooks = this.hooks.get(hookName)!;
        const index = hooks.indexOf(fn);
        if (index > -1) {
            hooks.splice(index, 1);
        }
    }

    /**
     * Execute all hooks for a given lifecycle event
     */
    execute<T>(hookName: string, initialValue: T, ...args: any[]): T {
        if (!this.hooks.has(hookName)) {
            throw new Error(`Invalid hook name: ${hookName}`);
        }
        return this.hooks.get(hookName)!.reduce((result, hook) => {
            return hook(result, ...args);
        }, initialValue);
    }

    /**
     * Convenience methods for common hooks
     */
    
    executePreProcessOriginalColumns(columns: AnyColumn<TRow>[]): AnyColumn<TRow>[] {
        return this.execute(LifecycleHooks.HOOKS.PRE_PROCESS_ORIGINAL_COLUMNS, columns);
    }

    executePostProcessOriginalColumns(columns: AnyColumn<TRow>[]): AnyColumn<TRow>[] {
        return this.execute(LifecycleHooks.HOOKS.POST_PROCESS_ORIGINAL_COLUMNS, columns);
    }

    executePreProcessColumns(columns: AnyColumn<TRow>[]): AnyColumn<TRow>[] {
        return this.execute(LifecycleHooks.HOOKS.PRE_PROCESS_COLUMNS, columns);
    }

    executePostProcessColumns(columns: AnyColumn<TRow>[]): AnyColumn<TRow>[] {
        return this.execute(LifecycleHooks.HOOKS.POST_PROCESS_COLUMNS, columns);
    }

    executePreProcessData(data: TRow[]): TRow[] {
        return this.execute(LifecycleHooks.HOOKS.PRE_PROCESS_DATA, data);
    }

    executePostProcessData(data: TRow[]): TRow[] {
        return this.execute(LifecycleHooks.HOOKS.POST_PROCESS_DATA, data);
    }

    executePreSort(data: TRow[]): TRow[] {
        return this.execute(LifecycleHooks.HOOKS.PRE_SORT, data);
    }

    executePostSort(data: TRow[]): TRow[] {
        return this.execute(LifecycleHooks.HOOKS.POST_SORT, data);
    }


    executePreFilter(data: TRow[]): TRow[] {
        return this.execute(LifecycleHooks.HOOKS.PRE_FILTER, data);
    }

    executePostFilter(data: TRow[]): TRow[] {
        return this.execute(LifecycleHooks.HOOKS.POST_FILTER, data);
    }

    executePreGlobalSearch(data: TRow[]): TRow[] {
        return this.execute(LifecycleHooks.HOOKS.PRE_GLOBAL_SEARCH, data);
    }

    executePostGlobalSearch(data: TRow[]): TRow[] {
        return this.execute(LifecycleHooks.HOOKS.POST_GLOBAL_SEARCH, data);
    }

    /**
     * Clear all hooks for a specific lifecycle event
     */
    clear(hookName: string) {
        if (!this.hooks.has(hookName)) {
            throw new Error(`Invalid hook name: ${hookName}`);
        }
        this.hooks.set(hookName, []);
    }

    /**
     * Clear all hooks
     */
    clearAll() {
        Object.values(LifecycleHooks.HOOKS).forEach(hookName => {
            this.hooks.set(hookName, []);
        });
    }
}