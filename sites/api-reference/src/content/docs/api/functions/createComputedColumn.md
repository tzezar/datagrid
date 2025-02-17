---
editUrl: false
next: true
prev: true
title: "createComputedColumn"
---

> **createComputedColumn**\<`TOriginalRow`, `TMeta`\>(`__namedParameters`): [`ComputedColumn`](/api/interfaces/computedcolumn/)\<`TOriginalRow`\>

Defined in: core/column-creation/computed-column-creator.ts:44

Creates a new computed column object, which represents a column that dynamically computes its value.
This function constructs the computed column by validating properties, generating the column ID,
and setting default options and state. It includes helper methods like `isVisible`, `isSortable`,
and `isFilterable` to check properties of the column.

## Type Parameters

• **TOriginalRow** *extends* `Record`\<`string`, `any`\>

The type representing the original row data structure.

• **TMeta**

The type for metadata associated with the computed column.

## Parameters

### \_\_namedParameters

[`CreateComputeColumnProps`](/api/type-aliases/createcomputecolumnprops/)\<`TOriginalRow`, `TMeta`\>

## Returns

[`ComputedColumn`](/api/interfaces/computedcolumn/)\<`TOriginalRow`\>

The created computed column object.
