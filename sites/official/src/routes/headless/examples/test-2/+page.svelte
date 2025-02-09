<script lang="ts">
	type AccessorColumn<TOriginalRow = any> = {
		type: 'accessor';
		header: string;
	};

	type ColumnGroup<TOriginalRow = any> = {
		type: 'group';
		header: string;
		columns: Column<TOriginalRow>[]; // It will recursively reference the Column type
	};

	type Column<TOriginalRow = any> = (AccessorColumn<TOriginalRow> | ColumnGroup<TOriginalRow>) & {
		parentId: string | null;
		depth: number;
	};

	type AccesorColumnCreator<TOriginalRow = any> = {
		type: 'accessor';
		header: string;
	};

	type GroupColumnCreator<TOriginalRow = any> = {
		type: 'group';
		header: string;
		columns: ColumnCreator<TOriginalRow>[];
	};

	type ColumnCreator<TOriginalRow = any> =
		| AccesorColumnCreator<TOriginalRow>
		| GroupColumnCreator<TOriginalRow>;

	let columns: ColumnCreator[] = [
		{
			type: 'accessor',
			header: 'ID'
		},
		{
			type: 'group',
			header: 'Product',
			columns: [
				{
					type: 'group',
					header: 'Details',
					columns: [
						{
							type: 'accessor',
							header: 'Name'
						},
						{
							type: 'accessor',
							header: 'Category'
						}
					]
				},
				{
					type: 'group',
					header: 'Informations',
					columns: [
						{
							type: 'accessor',
							header: 'Price'
						},
						{
							type: 'accessor',
							header: 'Quantity'
						}
					]
				}
			]
		},
		{
			type: 'group',
			header: 'Supplier',
			columns: [
				{
					type: 'accessor',
					header: 'Supplier name'
				},
				{
					type: 'accessor',
					header: 'Supplier address'
				}
			]
		},
		{
			type: 'accessor',
			header: 'Status'
		}
	];

	function initializeColumns(columns: ColumnCreator[]): Column[] {
		const insertValues = (
			columns: ColumnCreator[],
			parentId: string | null,
			depth = 0
		): Column[] => {
			return columns.map((col) => {
				if (col.type === 'group' && col.columns) {
					// For group columns, insert values recursively for nested columns
					const updatedColumn = { ...col, parentId, depth };
					updatedColumn.columns = insertValues(col.columns, col.header, depth + 1);
					return updatedColumn as Column;
				}

				// For non-group columns, just update parentId and depth
				return { ...col, parentId, depth } as Column;
			});
		};

		return insertValues(columns, null); // Start with root columns having null as parentId
	}

	function refreshColumnDepthAndParent(columns: Column[]): Column[] {
		const insertValues = (
			columns: ColumnCreator[],
			parentId: string | null,
			depth = 0
		): Column[] => {
			return columns.map((col) => {
				if (col.type === 'group' && col.columns) {
					// For group columns, insert values recursively for nested columns
					const updatedColumn = { ...col, parentId, depth };
					updatedColumn.columns = insertValues(col.columns, col.header, depth + 1);
					return updatedColumn as Column;
				}

				// For non-group columns, just update parentId and depth
				return { ...col, parentId, depth } as Column;
			});
		};

		return insertValues(columns, null); // Start with root columns having null as parentId
	}

	function flattenColumns(columns: Column[]): Column[] {
		const flattened: Column[] = [];

		columns.forEach((col) => {
			if (col.type === 'group') {
				// Flatten the group column with its inner columns
				flattened.push({ ...col });
				flattened.push(...flattenColumns(col.columns));
			} else {
				flattened.push(col);
			}
		});

		return flattened;
	}

	function flattenColumnsAndClearColumns(columns: Column[]): Column[] {
		const flattened: Column[] = [];

		columns.forEach((col) => {
			if (col.type === 'group') {
				const newCol = { ...col, columns: [] }; // Clear only for output, not internal structure
				flattened.push(newCol);
				flattened.push(...flattenColumnsAndClearColumns(col.columns)); // Keep hierarchy in recursion
			} else {
				flattened.push(col);
			}
		});

		return flattened;
	}

	function restoreHierarchy(columns: Column[]): Column[] {
		const columnMap = new Map<string, Column>(); // Map columnId to column
		const rootColumns: Column[] = [];
		// Populate the column map

		columns.forEach((col) => {
			if (col.type === 'group') {
				columnMap.set(col.header, { ...col, columns: [] });
			} else {
				columnMap.set(col.header, { ...col });
			}
		});

		// Rebuild hierarchy
		columns.forEach((col) => {
			if (col.parentId && columnMap.has(col.parentId)) {
				const parent = columnMap.get(col.parentId);
				if (parent && parent.type === 'group') {
					parent.columns.push(columnMap.get(col.header)!);
				}
			} else {
				rootColumns.push(columnMap.get(col.header)!);
			}
		});

		return rootColumns;
	}

	function getMaxDepth(columns: Column[]): number {
		return columns.reduce((max, col) => Math.max(max, col.depth), 0);
	}

	function createHeaderRows(columns: Column[]) {
		const naxDepth = getMaxDepth(columns);

		const rows: Column[][] = Array.from({ length: naxDepth + 1 }, () => []);

		const processColumn = (col: Column) => {
			// Ensure the column is placed at the correct level
			rows[col.depth].push({ ...col });

			// If the column is a group, process its children
			// if (col.type === 'group') {
			// 	col.columns.forEach((child) => processColumn(child, level + 1));
			// }
		};

		// Start processing all root columns at level 0
		columns.forEach((col) => processColumn(col));

		return rows;
	}

	const initializedColumns = initializeColumns(columns);

	const headerRows = createHeaderRows(flattenColumns(initializedColumns));

	console.log(headerRows);
</script>

<div>
	<div class="head">
		{#each headerRows as row}
			<div
				class="tr flex min-w-full max-w-fit bg-white"
				style="
			max-width: fit-content;
			overflow-hidden;
		"
			>
				{#each row as cell}
					<div
						class="th bg-white"
						data-pinned={cell.pinned}
						style="
					margin-left: {cell.left}px;
					width: {cell.width}px;
					max-width: {cell.width}px;
				"
					>
						<span class="sticky px-2">
							{cell.header}
						</span>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>
