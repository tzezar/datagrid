import type { ColumnDef } from "../types";

export type HookFunction<T = any> = (...args: any[]) => T;

/**
 * A class for managing lifecycle hooks in the datagrid system. It allows registering, unregistering, and executing hooks
 * at various points during the lifecycle of the datagrid, such as before and after data processing, sorting, filtering, 
 * and global search operations. Hooks can be executed in a specific order to modify the behavior of the datagrid's internal processes.
 *
 * @template TRow - The type representing a single row in the datagrid's data.
 */
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

    /**
     * Initializes the lifecycle hooks for various stages in the datagrid's process.
     */
    constructor() {
        // Initialize all hook arrays
        Object.values(LifecycleHooks.HOOKS).forEach(hookName => {
            this.hooks.set(hookName, []);
        });
    }

    /**
     * Registers a hook function for a specific lifecycle event.
     * 
     * @param {string} hookName - The name of the lifecycle event to register the hook for.
     * @param {HookFunction} fn - The hook function to register.
     * 
     * @throws {Error} If the hook name is invalid.
     */
    register(hookName: string, fn: HookFunction) {
        if (!this.hooks.has(hookName)) {
            throw new Error(`Invalid hook name: ${hookName}`);
        }
        this.hooks.get(hookName)!.push(fn);
    }

    /**
     * Unregisters a hook function for a specific lifecycle event.
     * 
     * @param {string} hookName - The name of the lifecycle event to unregister the hook from.
     * @param {HookFunction} fn - The hook function to unregister.
     * 
     * @throws {Error} If the hook name is invalid.
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
     * Executes all hooks for a specific lifecycle event, passing an initial value and arguments to the hooks.
     * 
     * @param {string} hookName - The name of the lifecycle event to execute hooks for.
     * @param {T} initialValue - The initial value to pass to the first hook.
     * @param {...any[]} args - Additional arguments to pass to each hook.
     * 
     * @returns {T} - The value returned by the last hook executed.
     * 
     * @throws {Error} If the hook name is invalid.
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
     * Executes the pre-processing hooks for original columns.
     * 
     * @param {ColumnDef<TRow>[]} columns - The original columns to process.
     * 
     * @returns {ColumnDef<TRow>[]} - The processed columns.
     */
    executePreProcessOriginalColumns(columns: ColumnDef<TRow>[]): ColumnDef<TRow>[] {
        return this.execute(LifecycleHooks.HOOKS.PRE_PROCESS_ORIGINAL_COLUMNS, columns);
    }

    /**
     * Executes the post-processing hooks for original columns.
     * 
     * @param {ColumnDef<TRow>[]} columns - The original columns to process.
     * 
     * @returns {ColumnDef<TRow>[]} - The processed columns.
     */
    executePostProcessOriginalColumns(columns: ColumnDef<TRow>[]): ColumnDef<TRow>[] {
        return this.execute(LifecycleHooks.HOOKS.POST_PROCESS_ORIGINAL_COLUMNS, columns);
    }

    /**
     * Executes the pre-processing hooks for columns.
     * 
     * @param {ColumnDef<TRow>[]} columns - The columns to process.
     * 
     * @returns {ColumnDef<TRow>[]} - The processed columns.
     */
    executePreProcessColumns(columns: ColumnDef<TRow>[]): ColumnDef<TRow>[] {
        return this.execute(LifecycleHooks.HOOKS.PRE_PROCESS_COLUMNS, columns);
    }

    /**
     * Executes the post-processing hooks for columns.
     * 
     * @param {ColumnDef<TRow>[]} columns - The columns to process.
     * 
     * @returns {ColumnDef<TRow>[]} - The processed columns.
     */
    executePostProcessColumns(columns: ColumnDef<TRow>[]): ColumnDef<TRow>[] {
        return this.execute(LifecycleHooks.HOOKS.POST_PROCESS_COLUMNS, columns);
    }

    /**
     * Executes the pre-processing hooks for data.
     * 
     * @param {TRow[]} data - The data to process.
     * 
     * @returns {TRow[]} - The processed data.
     */
    executePreProcessData(data: TRow[]): TRow[] {
        return this.execute(LifecycleHooks.HOOKS.PRE_PROCESS_DATA, data);
    }

    /**
     * Executes the post-processing hooks for data.
     * 
     * @param {TRow[]} data - The data to process.
     * 
     * @returns {TRow[]} - The processed data.
     */
    executePostProcessData(data: TRow[]): TRow[] {
        return this.execute(LifecycleHooks.HOOKS.POST_PROCESS_DATA, data);
    }

    /**
     * Executes the pre-sort hooks for data.
     * 
     * @param {TRow[]} data - The data to sort.
     * 
     * @returns {TRow[]} - The sorted data.
     */
    executePreSort(data: TRow[]): TRow[] {
        return this.execute(LifecycleHooks.HOOKS.PRE_SORT, data);
    }

    /**
     * Executes the post-sort hooks for data.
     * 
     * @param {TRow[]} data - The data to sort.
     * 
     * @returns {TRow[]} - The sorted data.
     */
    executePostSort(data: TRow[]): TRow[] {
        return this.execute(LifecycleHooks.HOOKS.POST_SORT, data);
    }

    /**
     * Executes the pre-filter hooks for data.
     * 
     * @param {TRow[]} data - The data to filter.
     * 
     * @returns {TRow[]} - The filtered data.
     */
    executePreFilter(data: TRow[]): TRow[] {
        return this.execute(LifecycleHooks.HOOKS.PRE_FILTER, data);
    }

    /**
     * Executes the post-filter hooks for data.
     * 
     * @param {TRow[]} data - The data to filter.
     * 
     * @returns {TRow[]} - The filtered data.
     */
    executePostFilter(data: TRow[]): TRow[] {
        return this.execute(LifecycleHooks.HOOKS.POST_FILTER, data);
    }

    /**
     * Executes the pre-global-search hooks for data.
     * 
     * @param {TRow[]} data - The data to search.
     * 
     * @returns {TRow[]} - The search results.
     */
    executePreGlobalSearch(data: TRow[]): TRow[] {
        return this.execute(LifecycleHooks.HOOKS.PRE_GLOBAL_SEARCH, data);
    }

    /**
     * Executes the post-global-search hooks for data.
     * 
     * @param {TRow[]} data - The data to search.
     * 
     * @returns {TRow[]} - The search results.
     */
    executePostGlobalSearch(data: TRow[]): TRow[] {
        return this.execute(LifecycleHooks.HOOKS.POST_GLOBAL_SEARCH, data);
    }

    /**
     * Clears all hooks for a specific lifecycle event.
     * 
     * @param {string} hookName - The name of the lifecycle event to clear hooks for.
     * 
     * @throws {Error} If the hook name is invalid.
     */
    clear(hookName: string) {
        if (!this.hooks.has(hookName)) {
            throw new Error(`Invalid hook name: ${hookName}`);
        }
        this.hooks.set(hookName, []);
    }

    /**
     * Clears all hooks for all lifecycle events.
     */
    clearAll() {
        Object.values(LifecycleHooks.HOOKS).forEach(hookName => {
            this.hooks.set(hookName, []);
        });
    }
}
