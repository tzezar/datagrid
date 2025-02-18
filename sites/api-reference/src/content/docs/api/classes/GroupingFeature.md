---
editUrl: false
next: true
prev: true
title: "GroupingFeature"
---

Defined in: core/features/grouping.svelte.ts:31

A class that provides grouping functionality for the datagrid, allowing columns to be grouped and expanded/collapsed.

## Implements

- [`GroupingFeatureState`](/api/type-aliases/groupingfeaturestate/)

## Constructors

### new GroupingFeature()

> **new GroupingFeature**(`datagrid`, `config`?): [`GroupingFeature`](/api/classes/groupingfeature/)

Defined in: core/features/grouping.svelte.ts:57

Creates an instance of the GroupingFeature class, initializing it with the datagrid and optional configuration.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)

The datagrid instance to associate with the grouping feature.

##### config?

`Partial`

Optional configuration for the grouping feature.

#### Returns

[`GroupingFeature`](/api/classes/groupingfeature/)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="activegroups"></a> `activeGroups` | `string`[] | The list of columns currently used for grouping. | core/features/grouping.svelte.ts:38 |
| <a id="expandedgroups"></a> `expandedGroups` | `SvelteSet`\<`string`\> | A set of currently expanded group identifiers. | core/features/grouping.svelte.ts:41 |
| <a id="manual"></a> `manual` | `boolean` | Whether grouping is manually controlled. | core/features/grouping.svelte.ts:35 |
| <a id="maxactivegroups"></a> `maxActiveGroups` | `number` | The maximum number of groups that can be active at once. | core/features/grouping.svelte.ts:47 |
| <a id="maxexpandedgroups"></a> `maxExpandedGroups` | `number` | The maximum number of groups that can be expanded at any time. | core/features/grouping.svelte.ts:44 |
| <a id="ongroupingchange"></a> `onGroupingChange` | (`expandedGroups`: `string`[]) => `void` | Callback function triggered when the grouping state changes. | core/features/grouping.svelte.ts:50 |

## Methods

### collapseGroup()

> **collapseGroup**(`groupIdentifier`): `void`

Defined in: core/features/grouping.svelte.ts:97

Collapses a specific group and notifies the datagrid.

#### Parameters

##### groupIdentifier

`string`

The identifier of the group to collapse.

#### Returns

`void`

***

### expandGroup()

> **expandGroup**(`groupIdentifier`): `void`

Defined in: core/features/grouping.svelte.ts:84

Expands a specific group, notifying the datagrid and ensuring the group limit is not exceeded.

#### Parameters

##### groupIdentifier

`string`

The identifier of the group to expand.

#### Returns

`void`

***

### isColumnWithinGroup()

> **isColumnWithinGroup**(`columnId`): `boolean`

Defined in: core/features/grouping.svelte.ts:67

Checks if a column is part of the active grouping.

#### Parameters

##### columnId

`string`

The column identifier to check.

#### Returns

`boolean`

True if the column is part of the active grouping, false otherwise.

***

### isGroupExpanded()

> **isGroupExpanded**(`groupIdentifier`): `boolean`

Defined in: core/features/grouping.svelte.ts:76

Checks if a group is expanded.

#### Parameters

##### groupIdentifier

`string`

The identifier for the group to check.

#### Returns

`boolean`

True if the group is expanded, false otherwise.

***

### toggleGrouping()

> **toggleGrouping**(`columnId`): `void`

Defined in: core/features/grouping.svelte.ts:107

Toggles the grouping state of a column. If the column is already in the group, it will be collapsed;
if not, it will be expanded.

#### Parameters

##### columnId

`string`

The identifier of the column to toggle.

#### Returns

`void`

***

### updateActiveGroups()

> **updateActiveGroups**(`activeGroups`): `void` \| `Error`

Defined in: core/features/grouping.svelte.ts:121

Updates the list of active groups, ensuring it does not exceed the maximum limit of active groups.
Emits an event notifying the datagrid of the change.

#### Parameters

##### activeGroups

`string`[]

The new list of active groups.

#### Returns

`void` \| `Error`

#### Throws

If the number of active groups exceeds the maximum allowed.
