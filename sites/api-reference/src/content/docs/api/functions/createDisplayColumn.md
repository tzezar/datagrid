---
editUrl: false
next: true
prev: true
title: "createDisplayColumn"
---

> **createDisplayColumn**\<`TOriginalRow`, `TMeta`\>(`__namedParameters`): [`DisplayColumn`](/api/interfaces/displaycolumn/)\<`TOriginalRow`\>

Defined in: core/column-creation/display-column-creator.ts:44

Creates a new display column object, which represents a column used for displaying data in a table.
This function constructs the display column by validating properties, generating the column ID,
and setting default options and state. It includes helper methods like `isVisible`, `isSortable`,
and `isFilterable` to check properties of the column.

## Type Parameters

• **TOriginalRow** *extends* `Record`\<`string`, `any`\>

The type representing the original row data structure.

• **TMeta**

The type for metadata associated with the display column.

## Parameters

### \_\_namedParameters

[`CreateDisplayColumnProps`](/api/type-aliases/createdisplaycolumnprops/)\<`TOriginalRow`, `TMeta`\>

## Returns

[`DisplayColumn`](/api/interfaces/displaycolumn/)\<`TOriginalRow`\>

The created display column object.
