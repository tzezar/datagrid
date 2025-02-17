---
editUrl: false
next: true
prev: true
title: "GroupingFeatureState"
---

> **GroupingFeatureState**: `object`

Defined in: core/features/grouping.svelte.ts:14

Represents the state of the grouping feature in the datagrid, managing active and expanded groups.

## Type declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| <a id="activegroups"></a> `activeGroups` | [`ColumnId`](/api/type-aliases/columnid/)[] | core/features/grouping.svelte.ts:16 |
| <a id="expandedgroups"></a> `expandedGroups` | `SvelteSet`\<[`GridGroupRowIdentifier`](/api/type-aliases/gridgrouprowidentifier/)\> | core/features/grouping.svelte.ts:17 |
| <a id="manual"></a> `manual` | `boolean` | core/features/grouping.svelte.ts:15 |
| <a id="maxexpandedgroups"></a> `maxExpandedGroups` | `number` | core/features/grouping.svelte.ts:18 |
| <a id="ongroupingchange"></a> `onGroupingChange` | (`expandedGroups`) => `void` | core/features/grouping.svelte.ts:19 |
