<script lang="ts">
	import {
		createComputedColum,
		createColumn,
		createColumnGroup,
		createDisplayColumn,
		type AccessorColumn,
		type ColumnDef,
		type ComputedColumn,
		type DisplayColumn,
		type GroupColumn
	} from '$lib/tzezars-datagrid/core/v2/column-creators';

	export function isAccessorColumn<TData>(
		column: ColumnDef<TData>
	): column is AccessorColumn<TData> {
		return 'accessorKey' in column && column.accessorKey !== undefined;
	}

	export function isComputedColumn<TData>(
		column: ColumnDef<TData>
	): column is ComputedColumn<TData> {
		return 'accessorFn' in column && typeof column.accessorFn === 'function';
	}

	export function isDisplayColumn<TData>(column: ColumnDef<TData>): column is DisplayColumn<TData> {
		return (
			'cell' in column &&
			typeof column.cell === 'function' &&
			!('accessorKey' in column || 'accessorFn' in column)
		);
	}

	export function isGroupColumn<TData>(column: ColumnDef<TData>): column is GroupColumn<TData> {
		return 'columns' in column && Array.isArray(column.columns);
	}

	interface User {
		id: number;
		firstName: string;
		lastName: string;
		profile: {
			age: number;
			email: string;
		};
		stats: {
			visits: number;
			lastLogin: Date;
		};
		status: 'active' | 'inactive';
	}

	// Example columns with full IntelliSense support
	export const userColumns: ColumnDef<User>[] = [
		// Basic column - will suggest all possible keys from User interface
		createColumn({
			header: 'First Name',
			accessorKey: 'firstName',
			getValue: (row) => row.firstName,
			options: { sortable: true }
		}),
		createColumn({ header: 'Age', accessorKey: 'profile.age', getValue: (row) => row.profile.age }),

		// Computed column with type checking
		createComputedColum({
			header: 'Full Name',
			accessorFn: (row) => `${row.firstName} ${row.lastName}`,
            getValue: (row) => `${row.firstName} ${row.lastName}`,
            options: { sortable: true }
		}),

		// Display column with type-safe row access
		createDisplayColumn({
			header: 'Status',
			cell: (row) =>
				`<span class="${row.status}">${row.status}</span>`,
			options: { sortable: true }
		}),

		// Grouped columns
		createColumnGroup({
			header: 'Profile',
			columns: [
				createColumn({
					header: 'Email',
					accessorKey: 'profile.email',
					getValue: (row) => row.profile.email,
					options: { sortable: true }
				}),
				createComputedColum({
					header: 'Last Active',
					accessorFn: (row) => row.stats.lastLogin.toLocaleDateString(),
                    getValue: (row) => row.stats.lastLogin.toLocaleDateString(),
                })
			]
		})
	];

	let data: User[] = $state([
		{
			id: 1,
			firstName: 'John',
			lastName: 'Doe',
			profile: {
				age: 30,
				email: 'jdoe@me.com'
			},
			stats: {
				visits: 100,
				lastLogin: new Date()
			},
			status: 'active'
		},
		{
			id: 2,
			firstName: 'Jane',
			lastName: 'Doe',
			profile: {
				age: 30,
				email: 'jdoe@me.com'
			},
			stats: {
				visits: 100,
				lastLogin: new Date()
			},
			status: 'inactive'
		}
	]);

	console.log(userColumns);
</script>

<div class="grid-wrapper">
	<div class="grid">
		<div class="grid-header">
			<div class="grid-header-row">
				{#each userColumns as column}
					{#if isGroupColumn(column)}
						<div class="grid-header-group">
							<div class="grid-header-group-cell">{column.header}</div>
							<div class="grid-header-row">
								<!-- ! Can be grouped again -->
								{#each column.columns as columnBase}
									<div class="grid-header-cell">{columnBase.header}</div>
								{/each}
							</div>
						</div>
					{:else if isDisplayColumn(column)}
						<div class="grid-header-cell">{column.header}</div>
					{:else if isComputedColumn(column)}
						<div class="grid-header-cell">{column.header}</div>
					{:else if isAccessorColumn(column)}
						<div class="grid-header-cell">{column.header}</div>
					{/if}
				{/each}
			</div>
		</div>
		<div class="grid-body">
			{#each data as row}
				<div class="grid-body-row">
					{#each userColumns as column}
						{#if isGroupColumn(column)}
							{#each column.columns as columnBase}
								{#if isDisplayColumn(columnBase)}
									<div class="grid-body-cell">display</div>
								{:else if isAccessorColumn(columnBase)}
									<div class="grid-body-cell">{columnBase.getValue(row)}</div>
								{:else if isComputedColumn(columnBase)}
									<div class="grid-body-cell">{columnBase.getValue(row)}</div>
								{/if}
							{/each}
						{:else if isDisplayColumn(column)}
							<div class="grid-body-cell">{@html column.cell(row)}</div>
						{:else if isAccessorColumn(column)}
							<div class="grid-body-cell">{column.getValue(row)}</div>
						{:else if isComputedColumn(column)}
							<div class="grid-body-cell">{column.getValue(row)}</div>
						{/if}
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.grid-wrapper {
		width: 1000px;
		height: 400px;
		overflow: auto;
	}

	.grid {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.grid-header {
		display: flex;
		flex-direction: column;
	}

	.grid-header-row {
		display: flex;
		flex-direction: row;
	}

	.grid-header-cell {
		width: 120px;
		border-bottom: 1px solid;
		border-right: 1px solid;
	}

	.grid-header-group {
		display: flex;
		flex-direction: column;
	}
	.grid-header-group-cell {
		width: 100%;
		border-bottom: 1px solid;
		border-right: 1px solid;
	}

	.grid-body {
		display: flex;
		flex-direction: column;
	}

	.grid-body-row {
		width: 100%;
		display: flex;
		flex-direction: row;
	}

	.grid-body-cell {
		width: 120px
	}
</style>
