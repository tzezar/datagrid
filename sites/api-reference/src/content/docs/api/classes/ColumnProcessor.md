---
editUrl: false
next: true
prev: true
title: "ColumnProcessor"
---

Defined in: core/processors/column-processor.svelte.ts:12

A class responsible for processing and managing columns in a datagrid.
It handles operations like initialization, assigning parent column IDs, 
grouping, pinning, and generating column hierarchies.

## Type Parameters

• **TOriginalRow**

## Constructors

### new ColumnProcessor()

> **new ColumnProcessor**\<`TOriginalRow`\>(`datagrid`): [`ColumnProcessor`](/api/classes/columnprocessor/)\<`TOriginalRow`\>

Defined in: core/processors/column-processor.svelte.ts:20

Initializes a new ColumnProcessor instance.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\>

The datagrid instance this processor will operate on.

#### Returns

[`ColumnProcessor`](/api/classes/columnprocessor/)\<`TOriginalRow`\>

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="datagrid-1"></a> `datagrid` | [`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\> | core/processors/column-processor.svelte.ts:13 |

## Methods

### assignParentColumnIds()

> **assignParentColumnIds**(`columns`, `parentColumnId`): [`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`\>[]

Defined in: core/processors/column-processor.svelte.ts:55

Recursively assigns parent column IDs to each column in the provided list.

#### Parameters

##### columns

[`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`\>[]

The columns to process.

##### parentColumnId

`string` = `null`

The parent column ID to assign to child columns.

#### Returns

[`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`\>[]

The columns with assigned parent column IDs.

***

### calculateColSpan()

> **calculateColSpan**(`col`): `number`

Defined in: core/processors/column-processor.svelte.ts:168

Calculates the column span for a given column.
If the column is a group column, the span is calculated based on its visible children.

#### Parameters

##### col

[`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`\>

The column to calculate the span for.

#### Returns

`number`

The calculated column span.

***

### createColumnHierarchy()

> **createColumnHierarchy**\<`TOriginalRow`\>(`partialFlatColumns`): [`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`\>[]

Defined in: core/processors/column-processor.svelte.ts:119

Creates a column hierarchy from the given flat column definitions.
This function organizes the columns into a tree structure where group columns are parents 
and regular columns are their children.

#### Type Parameters

• **TOriginalRow**

#### Parameters

##### partialFlatColumns

[`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`\>[]

The flat list of columns to structure into a hierarchy.

#### Returns

[`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`\>[]

A hierarchical column structure.

***

### generateHeaderRows()

> **generateHeaderRows**(`cols`): [`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`\>[][]

Defined in: core/processors/column-processor.svelte.ts:203

Generates the header rows for the datagrid based on the column hierarchy.
Each header row contains columns that span across the grid, depending on their position in the hierarchy.

#### Parameters

##### cols

[`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`\>[]

The columns to generate header rows for.

#### Returns

[`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`\>[][]

A 2D array representing the rows of the header.

***

### getMaxDepth()

> **getMaxDepth**(`cols`): `number`

Defined in: core/processors/column-processor.svelte.ts:187

Determines the maximum depth of a column hierarchy.

#### Parameters

##### cols

[`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`\>[]

The columns to calculate the depth for.

#### Returns

`number`

The maximum depth of the column hierarchy.

***

### initializeColumns()

> **initializeColumns**(`columns`): [`ColumnDef`](/api/type-aliases/columndef/)\<`any`\>[]

Defined in: core/processors/column-processor.svelte.ts:31

Initializes the columns by executing pre- and post-processing hooks, 
placing group columns at the front, and enhancing column definitions with `isGroupColumn` flag.

#### Parameters

##### columns

[`ColumnDef`](/api/type-aliases/columndef/)\<`any`\>[]

An array of column definitions to initialize.

#### Returns

[`ColumnDef`](/api/type-aliases/columndef/)\<`any`\>[]

The processed column definitions.

***

### placeGroupColumnsInFront()

> **placeGroupColumnsInFront**(`columns`): [`ColumnDef`](/api/type-aliases/columndef/)\<`any`\>[]

Defined in: core/processors/column-processor.svelte.ts:72

Places the group columns at the front of the column list based on the active grouping.

#### Parameters

##### columns

[`ColumnDef`](/api/type-aliases/columndef/)\<`any`\>[]

The columns to reorder.

#### Returns

[`ColumnDef`](/api/type-aliases/columndef/)\<`any`\>[]

The columns with group columns placed at the front.

***

### refreshColumnPinningOffsets()

> **refreshColumnPinningOffsets**(`columns`?): `void`

Defined in: core/processors/column-processor.svelte.ts:91

Refreshes the column pinning offsets based on the given or default columns.

#### Parameters

##### columns?

[`ColumnDef`](/api/type-aliases/columndef/)\<`any`\>[]

The columns to update pinning offsets for (defaults to all columns).

#### Returns

`void`
