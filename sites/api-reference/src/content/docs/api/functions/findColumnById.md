---
editUrl: false
next: true
prev: true
title: "findColumnById"
---

> **findColumnById**\<`TOriginalRow`\>(`flatColumns`, `id`): [`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`\>

Defined in: core/utils.svelte.ts:153

Finds a column by its unique ID in a flat list of column definitions.

## Type Parameters

• **TOriginalRow**

## Parameters

### flatColumns

[`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`\>[]

The array of column definitions, assumed to be already flattened.

### id

`string`

The unique identifier of the column to find.

## Returns

[`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`\>

The column definition if found, otherwise null.
