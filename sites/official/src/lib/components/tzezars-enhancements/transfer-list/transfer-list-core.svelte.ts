import { SvelteSet } from "svelte/reactivity"


export type ItemFilterPredicate<T> = (item: T, search: string) => boolean

export type TransferListCoreConfig<T> = {
    filterPredicate: ItemFilterPredicate<T>,
    initialSource: T[]
    initialTarget?: T[]
}

export class TransferListCore<T> {
    source: T[] = $state([])
    target: T[] = $state([])

    selectedSourceItems: SvelteSet<T> = $state(new SvelteSet())
    selectedTargetItems: SvelteSet<T> = $state(new SvelteSet())

    sourceSearchQuery: string = $state("")
    targetSearchQuery: string = $state("")

    private filterPredicate: ItemFilterPredicate<T>

    constructor({ filterPredicate: filterFn, initialSource, initialTarget = [] }: TransferListCoreConfig<T>) {
        this.source = initialSource
        this.target = initialTarget
        this.filterPredicate = filterFn
    }

    isSelected(side: 'source' | 'target', item: T): boolean {
        return (side === 'source' ? this.selectedSourceItems : this.selectedTargetItems).has(item)
    }
    hasSourceSelection() { return this.selectedSourceItems.size > 0 }
    hasTargetSelection() { return this.selectedTargetItems.size > 0 }

    get filteredSource(): T[] {
        if (!this.sourceSearchQuery) return this.source
        return this.source.filter(item => this.filterPredicate(item, this.sourceSearchQuery))
    }

    get filteredTarget(): T[] {
        if (!this.targetSearchQuery) return this.target
        return this.target.filter(item => this.filterPredicate(item, this.targetSearchQuery))
    }

    // Search handling
    updateSearch(side: 'source' | 'target', query: string): void {
        if (side === 'source') {
            this.sourceSearchQuery = query
        } else {
            this.targetSearchQuery = query
        }
    }

    clearSearch(side: 'source' | 'target'): void {
        this.updateSearch(side, "")
    }

    // Selection handling
    toggleSelection(side: 'source' | 'target', item: T): void {
        const selectionSet = side === 'source' ? this.selectedSourceItems : this.selectedTargetItems
        if (selectionSet.has(item)) {
            selectionSet.delete(item)
        } else {
            selectionSet.add(item)
        }
    }

    // Transfer operations
    transferAll(fromSide: 'source' | 'target'): void {
        if (fromSide === 'source') {
            this.target = [...this.target, ...this.source]
            this.source = []
            this.selectedSourceItems.clear()
        } else {
            this.source = [...this.source, ...this.target]
            this.target = []
            this.selectedTargetItems.clear()
        }
    }

    transferSelected(fromSide: 'source' | 'target'): void {
        if (fromSide === 'source') {
            const selectedItems = Array.from(this.selectedSourceItems)
            this.target = [...this.target, ...selectedItems]
            this.source = this.source.filter(item => !this.selectedSourceItems.has(item))
            this.selectedSourceItems.clear()
        } else {
            const selectedItems = Array.from(this.selectedTargetItems)
            this.source = [...this.source, ...selectedItems]
            this.target = this.target.filter(item => !this.selectedTargetItems.has(item))
            this.selectedTargetItems.clear()
        }
    }

}