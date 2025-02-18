---
editUrl: false
next: true
prev: true
title: "createColumnGroup"
---

> **createColumnGroup**\<`TOriginalRow`, `TMeta`\>(`__namedParameters`): [`ColumnGroup`](/api/interfaces/columngroup/)\<`TOriginalRow`\>

Defined in: core/column-creation/column-group-creator.ts:41

Creates a new column group object, which represents a group of columns in a table.
This function constructs the column group by validating properties, generating the column ID, 
and setting default options and state. It includes helper methods like `isVisible`, `isSortable`, 
and `isFilterable` to check properties of the group.

## Type Parameters

• **TOriginalRow**

The type representing the original row data structure.

• **TMeta**

The type for metadata associated with the group column.

## Parameters

### \_\_namedParameters

[`CreateGroupColumnProps`](/api/type-aliases/creategroupcolumnprops/)\<`TOriginalRow`, `TMeta`\>

## Returns

[`ColumnGroup`](/api/interfaces/columngroup/)\<`TOriginalRow`\>

The created column group object.
