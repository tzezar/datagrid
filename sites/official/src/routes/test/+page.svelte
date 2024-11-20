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
			country: string;
		};
		stats: {
			visits: number;
			lastLogin: Date;
			averageSessionDuration: number; // in minutes
		};
		status: 'active' | 'inactive' | 'pending';
		role: 'admin' | 'user' | 'guest';
	}

	export const userColumns: ColumnDef<User>[] = [
		// Simple accessor columns
		createAccessorColumn({
			header: 'First Name',
			accessorKey: 'firstName',
			getValue: (row) => row.firstName,
			options: { sortable: true, filterable: true }
		}),
		createAccessorColumn({
			header: 'Age',
			accessorKey: 'profile.age',
			getValue: (row) => row.profile.age,
			options: { sortable: true, filterable: true }
		}),

		// Computed column for full name
		createComputedColum({
			header: 'Full Name',
			accessorFn: (row) => `${row.firstName} ${row.lastName}`,
			getValue: (row) => `${row.firstName} ${row.lastName}`,
			options: { sortable: true, filterable: true }
		}),

		// Conditional formatting for status
		createDisplayColumn({
			header: 'Status',
			cell: (row) => `<span class="${row.status}">${row.status.toUpperCase()}</span>`,
			options: { sortable: true },
			customStyle: (row) =>
				row.status === 'active'
					? 'text-green-600'
					: row.status === 'inactive'
						? 'text-gray-400'
						: 'text-yellow-500'
		}),

		// Grouped columns for profile
		createColumnGroup({
			header: 'Profile',
			columns: [
				createAccessorColumn({
					header: 'Email',
					accessorKey: 'profile.email',
					getValue: (row) => row.profile.email,
					options: { sortable: true, filterable: true },
					customTooltip: (row) => `Contact: ${row.profile.email}`
				}),
				createAccessorColumn({
					header: 'Country',
					accessorKey: 'profile.country',
					getValue: (row) => row.profile.country,
					options: { filterable: true }
				})
			]
		}),

		// Grouped columns for stats
		createColumnGroup({
			header: 'Stats',
			columns: [
				createAccessorColumn({
					header: 'Visits',
					accessorKey: 'stats.visits',
					getValue: (row) => row.stats.visits,
					options: { sortable: true }
				}),
				createComputedColum({
					header: 'Last Login',
					accessorFn: (row) => row.stats.lastLogin.toLocaleString(),
					getValue: (row) => row.stats.lastLogin.toLocaleString(),
					options: { sortable: true }
				}),
				createAccessorColumn({
					header: 'Avg. Session (mins)',
					accessorKey: 'stats.averageSessionDuration',
					getValue: (row) => row.stats.averageSessionDuration,
					options: { sortable: true }
				})
			]
		}),
        		// Role column with custom formatting
		createDisplayColumn({
			header: 'Role',
			cell: (row) => `<span class="badge role-${row.role}">${row.role.toUpperCase()}</span>`,
			options: { sortable: true, filterable: true },
			customStyle: (row) => `role-${row.role}` // Custom classes for styling
		}),
	];

	let data: User[] = [
		{
			id: 1,
			firstName: 'John',
			lastName: 'Doe',
			profile: {
				age: 30,
				email: 'jdoe@example.com',
				country: 'USA'
			},
			stats: {
				visits: 120,
				lastLogin: new Date('2024-11-15T10:30:00Z'),
				averageSessionDuration: 15
			},
			status: 'active',
			role: 'admin'
		},
		{
			id: 2,
			firstName: 'Jane',
			lastName: 'Smith',
			profile: {
				age: 25,
				email: 'jane.smith@example.com',
				country: 'UK'
			},
			stats: {
				visits: 80,
				lastLogin: new Date('2024-11-10T14:45:00Z'),
				averageSessionDuration: 12
			},
			status: 'inactive',
			role: 'user'
		},
		{
			id: 3,
			firstName: 'Alice',
			lastName: 'Johnson',
			profile: {
				age: 28,
				email: 'alice.johnson@example.com',
				country: 'Canada'
			},
			stats: {
				visits: 150,
				lastLogin: new Date('2024-11-18T18:00:00Z'),
				averageSessionDuration: 20
			},
			status: 'pending',
			role: 'guest'
		}
	];

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
	:root {
		--border-color: orange;
		--border-width: 1px;
	}

	.grid-wrapper {
		width: 100%;
		height: 400px;
		overflow: auto;
		border: var(--border-width) solid var(--border-color);
		box-sizing: border-box;
	}

	.grid {
		display: flex;
		flex-direction: column;
		width: 100%;
		min-width: max-content;
		height: 100%;
	}

	.grid-header,
	.grid-body {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	/* Row styles */
	.grid-header-row,
	.grid-body-row {
		display: flex;
		flex-direction: row;
		border-bottom: var(--border-width) solid var(--border-color);
		width: 100%;
	}

	/* Cell styles */
	.grid-header-cell,
	.grid-body-cell {
		width: 120px;
		flex-shrink: 0;
		padding: 8px;
		margin: 0;
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		position: relative;
		box-sizing: border-box;
		/* Move border to pseudo-element */
		&:not(:last-child)::after {
			content: '';
			position: absolute;
			right: 0;
			top: 0;
			bottom: 0;
			width: var(--border-width);
			background-color: var(--border-color);
		}
	}

	/* Group styles */
	.grid-header-group {
        
		display: flex;
		flex-direction: column;
		/* Remove direct border */
		position: relative;
		/* Add border using pseudo-element */
		&:not(:last-child)::after {
			content: '';
			position: absolute;
			right: 0;
			top: 0;
			bottom: 0;
			width: var(--border-width);
			background-color: var(--border-color);
		}
	}

	.grid-header-group-cell {
		width: 100%;
		padding: 8px;
		margin: 0;
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		border-bottom: var(--border-width) solid var(--border-color);
		box-sizing: border-box;
	}

	/* Handle nested group borders */
	.grid-header-group .grid-header-row {
		border-bottom: none;
		width: 100%;
	}

	.grid-header-group .grid-header-cell {
		border-bottom: none;
	}

	/* Fix for group headers spanning multiple columns */
	.grid-header-group {
		display: flex;
		flex-direction: column;
	}

	.grid-header-group .grid-header-group-cell {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* Fix for nested header rows in groups */
	.grid-header-group .grid-header-row {
		display: flex;
		flex-direction: row;
	}

	/* Optional: Add some padding and visual hierarchy */
	.grid-header-cell,
	.grid-body-cell,
	.grid-header-group-cell {
		padding: 8px 12px;
	}

	.grid-header-group-cell {
		font-weight: bold;
	}

	/* Fix for the width calculations */
	.grid-header-group {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}
</style>
