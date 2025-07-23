import CodeBlock from '$lib/components/tzezars-enhancements/code-block/code-block.svelte';
import CodePreview from '$lib/components/tzezars-enhancements/code-preview/code-preview.svelte';



const example1 = `const data = [
	{
		id: 1,
		name: 'Product',
		price: {
			retail: 20,
			currency: 'PLN'
		}
	}
];

// Define a type for better TypeScript support
type InventoryItem = {
	id: number;
	name: string;
	price: {
		retail: number;
		currency: string;
	};
};`;

const example2 = `import {
	accessorColumn,
	columnGroup,
	computedColumn,
	displayColumn,
	type ColumnDef
} from '$lib/datagrid/index.js';

export const columns = [
	// Simple column using direct data access
	accessorColumn({
		accessorKey: 'id'
	}),

	// Group of related columns
	columnGroup({
		header: 'Product',
		columns: [
			accessorColumn({
				accessorKey: 'name'
			}),
			computedColumn({
				header: 'Price',
				getValueFn: (row) => \`\${row.price.retail} \${row.price.currency}\`
			})
		]
	}),

	// Custom display column (e.g., for expansion controls)
	displayColumn({
		columnId: 'expansion',
		header: '',
		cell: () => '<div>+</div>'
	})
] satisfies ColumnDef<InventoryItem>[];`;


const example3 = `import { DatagridCore } from '$lib/datagrid/index.js';

const datagrid = new DatagridCore({
	columns,
	data
});`

const example4 = `const datagrid = new DatagridCore({
	columns,
	data,
	initialState: {
		sorting: { sortBy: 'id', sortDirection: 'asc' },
		pagination: { page: 1, pageSize: 25 }
	}
});`

const example5 = `class MySortingFeature extends SortingFeature {
	// You can set initial state here or define additional state
	isManual = $state(true);
	extraState = $state('');

	// You can override method to include your custom logic or extend feature with own methods
	isColumnSorted(columnId: string, direction: 'asc' | 'desc'): boolean {
		console.debug(\`[Sorting] Checking if column "\${columnId}" is sorted in "\${direction}" order.\`);
		return super.isColumnSorted(columnId, direction);
	}
}

const datagrid = new Grid.EnhancedCore({
	columns,
	data,
	features: {
		sorting: MySortingFeature
	}
});`

const example6 = `<div class="datagrid-wrapper">
	<div class="datagrid">
		<!-- Header -->
		<div class="datagrid-header">
			<div class="datagrid-row">
				{#each datagrid.columns.getLeafColumns() as column}
					<div class="datagrid-cell header-cell">
						{column.header}
					</div>
				{/each}
			</div>
		</div>

		<!-- Body -->
		<div class="datagrid-body">
			{#each datagrid.rows.getVisibleBasicRows() as row}
				<div class="datagrid-row">
					{#each datagrid.columns.getLeafColumns() as column}
						<div class="datagrid-cell">
							{getCellContent(column, row.original)}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>`

const example7 = `{#snippet CellRenderer(column: LeafColumn<any>, row: GridBasicRow<any>)}
	{@const cellContent = column.cell ? column.cell({ datagrid, column, row }) : null}
	<div class="td">
		{#if cellContent}
			{#if typeof cellContent === 'string'}
				{@html cellContent}
			{:else if isCellComponent(cellContent)}
				<cellContent.component {datagrid} {row} {column} />
			{/if}
		{:else}
			<span>
				{@html getCellContent(column, row.original)}
			</span>
		{/if}
	</div>
{/snippet}`


const example8 = `<script lang='ts'>
	import RenderCell from '$lib/datagrid/prebuilt/render-cell'
</script>

<div class="datagrid-body">
	{#each datagrid.rows.getVisibleBasicRows() as row}
		<div class="datagrid-row">
			{#each datagrid.columns.getLeafColumns() as column}
				<div class="datagrid-cell">
					<RenderCell {datagrid} {row} {column} />
				</div>
			{/each}
		</div>
	{/each}
</div>`

const example9 = `// Listen to events
datagrid.events.on('onColumnSort', ({ column }) => {
	console.log(\`Column \${column.id} was sorted\`);
});

// Use lifecycle hooks for custom processing
datagrid.hooks.registerHook('PRE_PROCESS_DATA', (data) => {
	// Modify or filter data before processing
	return data.filter((item) => item.active);
});`


const exports = {
	components: {
		codeBlock: CodeBlock,
		codePreview: CodePreview
	},

	code: {
		example1,
		example2,
    example3,
    example4,
    example5,
    example6,
    example7,
    example8,
    example9
	}
};

export { exports };