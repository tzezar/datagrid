---
editUrl: false
next: true
prev: true
title: "applySorting"
---

> **applySorting**\<`TOriginalRow`\>(`datagrid`, `data`): `TOriginalRow`[]

Defined in: core/processors/apply-sorting.ts:24

Applies sorting to the given data based on the sort configurations in the datagrid.
The function supports manual sorting and sorting defined in the datagrid's sorting feature.
It also uses a Schwartzian transform to precompute the sort values for improved performance.

## Type Parameters

• **TOriginalRow**

The type of the rows in the data array.

## Parameters

### datagrid

[`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`\>

The datagrid instance containing the sorting configuration and lifecycle hooks.

### data

`TOriginalRow`[]

The data array to be sorted.

## Returns

`TOriginalRow`[]

- The sorted data array.

## Remarks

- If manual sorting is enabled or no sorting configurations are defined, the data is returned without any changes.
- The sorting respects the direction specified in the `sortConfigs` and handles cases for null or undefined values.
- The Schwartzian Transform is used for precomputing the values to be sorted, which improves performance when sorting large datasets.
