---
editUrl: false
next: true
prev: true
title: "createAccessorColumn"
---

> **createAccessorColumn**\<`TOriginalRow`, `TKey`, `TMeta`\>(`props`): [`AccessorColumn`](/api/interfaces/accessorcolumn/)\<`TOriginalRow`, `TMeta`\>

Defined in: core/column-creation/accessor-column-creator.ts:128

Creates an accessor column configuration with proper type handling and validation.
This function is responsible for setting up the necessary properties of an accessor column, 
including validation of required fields, and calculating derived properties such as 
`header`, `columnId`, and `getValueFn`.

## Type Parameters

• **TOriginalRow** *extends* `Record`\<`string`, `any`\>

The type of the original row data.

• **TKey** *extends* `never`

The type of the key used to access data in the row.

• **TMeta**

The type of additional metadata for the column.

## Parameters

### props

[`CreateAccessorColumnProps`](/api/type-aliases/createaccessorcolumnprops/)\<`TOriginalRow`, `TKey`, `TMeta`\>

The properties for creating the accessor column.

## Returns

[`AccessorColumn`](/api/interfaces/accessorcolumn/)\<`TOriginalRow`, `TMeta`\>

The created accessor column configuration.

## Throws

Throws an error if `accessorKey` is not provided.

## Example

```ts
const column = createAccessorColumn({
  accessorKey: "profile.email",
  header: "Email Address",
  options: { searchable: true },
  state: { size: 200 }
});
// Returns an accessor column object with the defined properties
```
