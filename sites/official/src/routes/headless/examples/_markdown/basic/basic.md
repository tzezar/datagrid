---
title: Basic datagrid
description: Most basic headless implementation.
---

<script>
	import {exports} from './exports.ts'
</script>

# {title}

{description}

## Example

<exports.components.codePreview code={exports.basic.code} class="">
	<exports.basic.component />
</exports.components.codePreview> 

## Key Points

1. **State Management:** 

	`DatagridCore` is responsible for maintaining the entire state of the datagrid, including columns, rows, sorting, filtering, selection, and pagination.  
2. **Mandatory Columns:** 

	The `columns` configuration is required for the datagrid to function properly.  
3. **Retrieving Leaf Columns:** `
	
	datagrid.columns.getLeafColumns()` is used to extract the lowest-level columns in a hierarchical column structure, ensuring correct TypeScript typings and preventing runtime errors.  
4. **Processing Rows Safely:** 

	We iterate over the rows obtained from `datagrid.rows.getVisibleBasicRows()`, which ensures that only visible rows are processed while satisfying TypeScript constraints.  
5. **Cell Rendering Logic:** 

	The `getCellContent(column, row.original)` function determines the correct content to render for each cell by mapping the given column to its corresponding data in the row.  
6. **Performance Considerations:** 
	
	The system is optimized to handle large datasets efficiently by working with only the necessary subset of data at any given time.  
7. **Extensibility:** 

	The architecture allows for additional features such as custom cell rendering, row virtualization, and advanced filtering without disrupting core functionality.  

8. **Styling Flexibility:** 

	The structure is designed to be flexible in terms of styling. It is up to the user to decide how to style and render the datagrid. The following example demonstrates a possible approach using `@apply` with Tailwind CSS to create a structure similar to a traditional table, but users are free to apply their own styles and layout as needed.  

