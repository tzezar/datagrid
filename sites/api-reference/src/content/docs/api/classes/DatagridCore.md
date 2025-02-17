---
editUrl: false
next: true
prev: true
title: "DatagridCore"
---

Defined in: core/index.svelte.ts:21

Core class for managing the datagrid, handling state, events, processing, and features.

## Example

```ts
const datagrid = new DatagridCore({ columns: myColumns, data: myData });
```

## Type Parameters

• **TOriginalRow** = `any`

The type of the original data row.

• **TMeta** = `any`

Additional metadata type for columns.

## Constructors

### new DatagridCore()

> **new DatagridCore**\<`TOriginalRow`, `TMeta`\>(`config`, `lazyInitialization`): [`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`, `TMeta`\>

Defined in: core/index.svelte.ts:119

Creates an instance of DatagridCore.

#### Parameters

##### config

[`DatagridCoreConfig`](/api/type-aliases/datagridcoreconfig/)\<`TOriginalRow`\>

The datagrid configuration.

##### lazyInitialization

`boolean` = `false`

Whether to delay initialization.

#### Returns

[`DatagridCore`](/api/classes/datagridcore/)\<`TOriginalRow`, `TMeta`\>

#### Example

```typescript
const grid = new DatagridCore({ columns: [...], data: [...] });
```

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="_columns"></a> `_columns` | `public` | [`ColumnDef`](/api/type-aliases/columndef/)\<`TOriginalRow`, `TMeta`\>[] | Processed columns for internal use. | core/index.svelte.ts:53 |
| <a id="cachemanager"></a> `cacheManager` | `public` | [`DatagridCacheManager`](/api/classes/datagridcachemanager/)\<`TOriginalRow`\> | Cache management for the datagrid. | core/index.svelte.ts:76 |
| <a id="columns"></a> `columns` | `public` | `Columns`\<`TOriginalRow`\> | Column management instance. | core/index.svelte.ts:58 |
| <a id="events"></a> `events` | `readonly` | [`EventService`](/api/classes/eventservice/) | Event service for managing event subscriptions and emissions. | core/index.svelte.ts:25 |
| <a id="features"></a> `features` | `public` | [`DatagridFeatures`](/api/classes/datagridfeatures/)\<`TOriginalRow`\> | Feature manager for enabling/disabling specific datagrid features. | core/index.svelte.ts:103 |
| <a id="grididentifier"></a> `gridIdentifier` | `public` | `any` | Unique identifier for the grid instance. | core/index.svelte.ts:40 |
| <a id="handlers"></a> `handlers` | `readonly` | [`HandlersManager`](/api/classes/handlersmanager/) | Manages event handlers for the grid. | core/index.svelte.ts:35 |
| <a id="lifecyclehooks"></a> `lifecycleHooks` | `public` | [`LifecycleHooks`](/api/classes/lifecyclehooks/)\<`TOriginalRow`\> | Lifecycle hooks for pre/post processing operations. | core/index.svelte.ts:108 |
| <a id="measureperformance"></a> `measurePerformance` | `public` | `boolean` | Whether to measure performance metrics for grid operations. | core/index.svelte.ts:81 |
| <a id="originalstate"></a> `originalState` | `public` | `any` | Stores the original state of the datagrid, including columns and data. | core/index.svelte.ts:45 |
| <a id="performancemetrics"></a> `performanceMetrics` | `readonly` | [`PerformanceMetrics`](/api/classes/performancemetrics/) | Performance metrics tracker. | core/index.svelte.ts:30 |
| <a id="processors"></a> `processors` | `public` | `object` | Data and column processing managers. | core/index.svelte.ts:68 |
| `processors.column` | `public` | [`ColumnProcessor`](/api/classes/columnprocessor/)\<`TOriginalRow`\> | - | core/index.svelte.ts:70 |
| `processors.data` | `public` | [`DataDataProcessor`](/api/classes/datadataprocessor/)\<`TOriginalRow`\> | - | core/index.svelte.ts:69 |
| <a id="rowidgetter"></a> `rowIdGetter` | `public` | (`row`: `TOriginalRow`) => [`GridRowIdentifier`](/api/type-aliases/gridrowidentifier/) | Function to retrieve the row identifier. | core/index.svelte.ts:88 |
| <a id="rowindexgetter"></a> `rowIndexGetter` | `public` | (`row`: `TOriginalRow`, `parentIndex`: `string`, `index`: `number`) => `string` | Function to retrieve the row index. | core/index.svelte.ts:97 |
| <a id="rows"></a> `rows` | `public` | `Rows`\<`TOriginalRow`\> | Row management instance. | core/index.svelte.ts:63 |

## Methods

### initializeGridState()

> **initializeGridState**(`config`): `void`

Defined in: core/index.svelte.ts:137

Initializes the grid state based on the provided configuration.

#### Parameters

##### config

[`DatagridCoreConfig`](/api/type-aliases/datagridcoreconfig/)\<`TOriginalRow`\>

The datagrid configuration.

#### Returns

`void`

***

### refresh()

> **refresh**(`updateOperation`, `options`): `void`

Defined in: core/index.svelte.ts:183

Refreshes the datagrid with optional recalculations.

#### Parameters

##### updateOperation

() => `void`

The update function.

##### options

The recalculation options.

###### recalculateAll?

`boolean`

###### recalculateGroups?

`boolean`

###### recalculatePagination?

`boolean`

#### Returns

`void`

#### Example

```typescript
grid.refresh(() => {
    grid.rows.updateSomeData();
}, { recalculateAll: true });
```
