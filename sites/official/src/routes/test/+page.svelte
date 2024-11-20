<script lang="ts">
	import {
		createComputedColum,
		createAccessorColumn,
		createColumnGroup,
		createDisplayColumn,
		type ColumnDef,
		type GroupColumn
	} from '$lib/tzezars-datagrid/core/v2/column-creators';


	// Type guard for group columns
	function isGroupColumn(column: ColumnDef<User>): column is GroupColumn<User> {
		return column.type === 'group';
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
		createAccessorColumn({
			header: 'First Name',
			accessorKey: 'firstName',
			getValue: (row) => row.firstName,
			options: { sortable: true }
		}),
		createAccessorColumn({
			header: 'Age',
			accessorKey: 'profile.age',
			getValue: (row) => row.profile.age
		}),

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
			cell: (row) => `<span class="${row.status}">${row.status}</span>`,
			options: { sortable: true }
		}),

		// Grouped columns
		createColumnGroup({
			header: 'Profile',
			columns: [
				createColumnGroup({
					header: 'Profile',
					columns: [
						createAccessorColumn({
							header: 'Email',
							accessorKey: 'profile.email',
							getValue: (row) => row.profile.email,
							options: { sortable: true }
						}),
						createComputedColum({
							header: 'Last Active',
							accessorFn: (row) => row.stats.lastLogin.toLocaleDateString(),
							getValue: (row) => row.stats.lastLogin.toLocaleDateString()
						})
					]
				}),
				createAccessorColumn({
					header: 'Email',
					accessorKey: 'profile.email',
					getValue: (row) => row.profile.email,
					options: { sortable: true }
				}),
				createComputedColum({
					header: 'Last Active',
					accessorFn: (row) => row.stats.lastLogin.toLocaleDateString(),
					getValue: (row) => row.stats.lastLogin.toLocaleDateString()
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

	// Helper function to safely handle cell content
	function getCellContent(column: ColumnDef<User>, row: User): string | HTMLElement {
		if (column.type === 'display' && column.cell) {
			return column.cell(row);
		}
		if (column.getValue) {
			return String(column.getValue(row));
		}
		return '';
	}

	console.log(userColumns);
</script>

{#snippet HeaderCell(column: ColumnDef<User>)}
	{#if isGroupColumn(column)}
		<div class="grid-header-group">
			<div class="grid-header-group-cell">{column.header}</div>
			<div class="grid-header-row">
				{#each column.columns ?? [] as subColumn (subColumn.header)}
					{@render HeaderCell(subColumn)}
				{/each}
			</div>
		</div>
	{:else}
		<div class="grid-header-cell">{column.header}</div>
	{/if}
{/snippet}

<!-- Recursive body cell template -->
{#snippet BodyCell(column: ColumnDef<User>, row: User)}
	{#if isGroupColumn(column)}
		{#each column.columns ?? [] as subColumn (subColumn.header)}
			{@render BodyCell(subColumn, row)}
		{/each}
	{:else}
		<div class="grid-body-cell">
			{@html getCellContent(column, row)}
		</div>
	{/if}
{/snippet}

<div class="grid-wrapper">
	<div class="grid">
		<div class="grid-header">
			<div class="grid-header-row">
				{#each userColumns as column (column.header)}
					{@render HeaderCell(column)}
				{/each}
			</div>
		</div>
		<div class="grid-body">
			{#each data as row (row.id)}
				<div class="grid-body-row">
					{#each userColumns as column (column.header)}
						{@render BodyCell(column, row)}
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
		width: 120px;
	}
</style>
