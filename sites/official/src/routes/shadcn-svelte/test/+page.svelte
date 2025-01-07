<script lang="ts">
	import type { AnyColumn } from '$lib/datagrid/core/helpers/column-creators.js';
	import { userColumns } from './columns.svelte.js';
	import type { User } from './generate-users.js';

	let { data } = $props();

	class Datagrid {
		_columns: AnyColumn<User>[] = $state([]);
		leftColumns: AnyColumn<User>[] = $state([]);
		centerColumns: AnyColumn<User>[] = $state([]);
		rightColumns: AnyColumn<User>[] = $state([]);

		constructor(columns: AnyColumn<User>[]) {
			this.centerColumns = columns;
			this._columns = columns;
		}

		moveColumnLeft(column: AnyColumn<User>): void {
			const index = this.centerColumns.findIndex((col) => col === column);
			if (index > 0) {
				// Move the column only if it's not the first one.
				const [columnToMove] = this.centerColumns.splice(index, 1);
				this.centerColumns.splice(index - 1, 0, columnToMove);
			}
		}

		moveColumnRight(column: AnyColumn<User>): void {
			const index = this.centerColumns.findIndex((col) => col === column);
			if (index >= 0 && index < this.centerColumns.length - 1) {
				// Move the column only if it's not the last one.
				const [columnToMove] = this.centerColumns.splice(index, 1);
				this.centerColumns.splice(index + 1, 0, columnToMove);
			}
		}
		
        get columns(): AnyColumn<User>[] {
            return [...this.leftColumns, ...this.centerColumns, ...this.rightColumns];
        }
	}

	$effect(() => {
		console.log('left', $state.snapshot(datagrid.leftColumns));
		console.log('center', $state.snapshot(datagrid.centerColumns));
		console.log('right', $state.snapshot(datagrid.rightColumns));
	});

	const datagrid = new Datagrid(userColumns);
</script>

{#each datagrid.columns as column}
	<div>{column.header}</div>
	<button onclick={() => datagrid.moveColumnLeft(column)}>Move Left</button>
	<button onclick={() => datagrid.moveColumnRight(column)}>Move Right</button>
{/each}
