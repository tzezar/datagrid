---
editUrl: false
next: true
prev: true
title: "LifecycleHooks"
---

Defined in: core/managers/lifecycle-hooks-manager.svelte.ts:12

A class for managing lifecycle hooks in the datagrid system. It allows registering, unregistering, and executing hooks
at various points during the lifecycle of the datagrid, such as before and after data processing, sorting, filtering, 
and global search operations. Hooks can be executed in a specific order to modify the behavior of the datagrid's internal processes.

## Type Parameters

• **TRow**

The type representing a single row in the datagrid's data.

## Constructors

### new LifecycleHooks()

> **new LifecycleHooks**\<`TRow`\>(): [`LifecycleHooks`](/api/classes/lifecyclehooks/)\<`TRow`\>

Defined in: core/managers/lifecycle-hooks-manager.svelte.ts:34

Initializes the lifecycle hooks for various stages in the datagrid's process.

#### Returns

[`LifecycleHooks`](/api/classes/lifecyclehooks/)\<`TRow`\>

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="hooks"></a> `HOOKS` | `readonly` | `object` | core/managers/lifecycle-hooks-manager.svelte.ts:16 |
| `HOOKS.POST_FILTER` | `readonly` | `"postFilter"` | core/managers/lifecycle-hooks-manager.svelte.ts:28 |
| `HOOKS.POST_GLOBAL_SEARCH` | `readonly` | `"postGlobalSearch"` | core/managers/lifecycle-hooks-manager.svelte.ts:26 |
| `HOOKS.POST_PROCESS_COLUMNS` | `readonly` | `"postProcessColumns"` | core/managers/lifecycle-hooks-manager.svelte.ts:20 |
| `HOOKS.POST_PROCESS_DATA` | `readonly` | `"postProcessData"` | core/managers/lifecycle-hooks-manager.svelte.ts:22 |
| `HOOKS.POST_PROCESS_ORIGINAL_COLUMNS` | `readonly` | `"postProcessOriginalColumns"` | core/managers/lifecycle-hooks-manager.svelte.ts:18 |
| `HOOKS.POST_SORT` | `readonly` | `"postSort"` | core/managers/lifecycle-hooks-manager.svelte.ts:24 |
| `HOOKS.PRE_FILTER` | `readonly` | `"preFilter"` | core/managers/lifecycle-hooks-manager.svelte.ts:27 |
| `HOOKS.PRE_GLOBAL_SEARCH` | `readonly` | `"preGlobalSearch"` | core/managers/lifecycle-hooks-manager.svelte.ts:25 |
| `HOOKS.PRE_PROCESS_COLUMNS` | `readonly` | `"preProcessColumns"` | core/managers/lifecycle-hooks-manager.svelte.ts:19 |
| `HOOKS.PRE_PROCESS_DATA` | `readonly` | `"preProcessData"` | core/managers/lifecycle-hooks-manager.svelte.ts:21 |
| `HOOKS.PRE_PROCESS_ORIGINAL_COLUMNS` | `readonly` | `"preProcessOriginalColumns"` | core/managers/lifecycle-hooks-manager.svelte.ts:17 |
| `HOOKS.PRE_SORT` | `readonly` | `"preSort"` | core/managers/lifecycle-hooks-manager.svelte.ts:23 |

## Methods

### clear()

> **clear**(`hookName`): `void`

Defined in: core/managers/lifecycle-hooks-manager.svelte.ts:234

Clears all hooks for a specific lifecycle event.

#### Parameters

##### hookName

`string`

The name of the lifecycle event to clear hooks for.

#### Returns

`void`

#### Throws

If the hook name is invalid.

***

### clearAll()

> **clearAll**(): `void`

Defined in: core/managers/lifecycle-hooks-manager.svelte.ts:244

Clears all hooks for all lifecycle events.

#### Returns

`void`

***

### execute()

> **execute**\<`T`\>(`hookName`, `initialValue`, ...`args`): `T`

Defined in: core/managers/lifecycle-hooks-manager.svelte.ts:86

Executes all hooks for a specific lifecycle event, passing an initial value and arguments to the hooks.

#### Type Parameters

• **T**

#### Parameters

##### hookName

`string`

The name of the lifecycle event to execute hooks for.

##### initialValue

`T`

The initial value to pass to the first hook.

##### args

...`any`[]

Additional arguments to pass to each hook.

#### Returns

`T`

- The value returned by the last hook executed.

#### Throws

If the hook name is invalid.

***

### executePostFilter()

> **executePostFilter**(`data`): `TRow`[]

Defined in: core/managers/lifecycle-hooks-manager.svelte.ts:201

Executes the post-filter hooks for data.

#### Parameters

##### data

`TRow`[]

The data to filter.

#### Returns

`TRow`[]

- The filtered data.

***

### executePostGlobalSearch()

> **executePostGlobalSearch**(`data`): `TRow`[]

Defined in: core/managers/lifecycle-hooks-manager.svelte.ts:223

Executes the post-global-search hooks for data.

#### Parameters

##### data

`TRow`[]

The data to search.

#### Returns

`TRow`[]

- The search results.

***

### executePostProcessColumns()

> **executePostProcessColumns**(`columns`): [`ColumnDef`](/api/type-aliases/columndef/)\<`TRow`\>[]

Defined in: core/managers/lifecycle-hooks-manager.svelte.ts:135

Executes the post-processing hooks for columns.

#### Parameters

##### columns

[`ColumnDef`](/api/type-aliases/columndef/)\<`TRow`\>[]

The columns to process.

#### Returns

[`ColumnDef`](/api/type-aliases/columndef/)\<`TRow`\>[]

- The processed columns.

***

### executePostProcessData()

> **executePostProcessData**(`data`): `TRow`[]

Defined in: core/managers/lifecycle-hooks-manager.svelte.ts:157

Executes the post-processing hooks for data.

#### Parameters

##### data

`TRow`[]

The data to process.

#### Returns

`TRow`[]

- The processed data.

***

### executePostProcessOriginalColumns()

> **executePostProcessOriginalColumns**(`columns`): [`ColumnDef`](/api/type-aliases/columndef/)\<`TRow`\>[]

Defined in: core/managers/lifecycle-hooks-manager.svelte.ts:113

Executes the post-processing hooks for original columns.

#### Parameters

##### columns

[`ColumnDef`](/api/type-aliases/columndef/)\<`TRow`\>[]

The original columns to process.

#### Returns

[`ColumnDef`](/api/type-aliases/columndef/)\<`TRow`\>[]

- The processed columns.

***

### executePostSort()

> **executePostSort**(`data`): `TRow`[]

Defined in: core/managers/lifecycle-hooks-manager.svelte.ts:179

Executes the post-sort hooks for data.

#### Parameters

##### data

`TRow`[]

The data to sort.

#### Returns

`TRow`[]

- The sorted data.

***

### executePreFilter()

> **executePreFilter**(`data`): `TRow`[]

Defined in: core/managers/lifecycle-hooks-manager.svelte.ts:190

Executes the pre-filter hooks for data.

#### Parameters

##### data

`TRow`[]

The data to filter.

#### Returns

`TRow`[]

- The filtered data.

***

### executePreGlobalSearch()

> **executePreGlobalSearch**(`data`): `TRow`[]

Defined in: core/managers/lifecycle-hooks-manager.svelte.ts:212

Executes the pre-global-search hooks for data.

#### Parameters

##### data

`TRow`[]

The data to search.

#### Returns

`TRow`[]

- The search results.

***

### executePreProcessColumns()

> **executePreProcessColumns**(`columns`): [`ColumnDef`](/api/type-aliases/columndef/)\<`TRow`\>[]

Defined in: core/managers/lifecycle-hooks-manager.svelte.ts:124

Executes the pre-processing hooks for columns.

#### Parameters

##### columns

[`ColumnDef`](/api/type-aliases/columndef/)\<`TRow`\>[]

The columns to process.

#### Returns

[`ColumnDef`](/api/type-aliases/columndef/)\<`TRow`\>[]

- The processed columns.

***

### executePreProcessData()

> **executePreProcessData**(`data`): `TRow`[]

Defined in: core/managers/lifecycle-hooks-manager.svelte.ts:146

Executes the pre-processing hooks for data.

#### Parameters

##### data

`TRow`[]

The data to process.

#### Returns

`TRow`[]

- The processed data.

***

### executePreProcessOriginalColumns()

> **executePreProcessOriginalColumns**(`columns`): [`ColumnDef`](/api/type-aliases/columndef/)\<`TRow`\>[]

Defined in: core/managers/lifecycle-hooks-manager.svelte.ts:102

Executes the pre-processing hooks for original columns.

#### Parameters

##### columns

[`ColumnDef`](/api/type-aliases/columndef/)\<`TRow`\>[]

The original columns to process.

#### Returns

[`ColumnDef`](/api/type-aliases/columndef/)\<`TRow`\>[]

- The processed columns.

***

### executePreSort()

> **executePreSort**(`data`): `TRow`[]

Defined in: core/managers/lifecycle-hooks-manager.svelte.ts:168

Executes the pre-sort hooks for data.

#### Parameters

##### data

`TRow`[]

The data to sort.

#### Returns

`TRow`[]

- The sorted data.

***

### register()

> **register**(`hookName`, `fn`): `void`

Defined in: core/managers/lifecycle-hooks-manager.svelte.ts:49

Registers a hook function for a specific lifecycle event.

#### Parameters

##### hookName

`string`

The name of the lifecycle event to register the hook for.

##### fn

[`HookFunction`](/api/type-aliases/hookfunction/)

The hook function to register.

#### Returns

`void`

#### Throws

If the hook name is invalid.

***

### unregister()

> **unregister**(`hookName`, `fn`): `void`

Defined in: core/managers/lifecycle-hooks-manager.svelte.ts:64

Unregisters a hook function for a specific lifecycle event.

#### Parameters

##### hookName

`string`

The name of the lifecycle event to unregister the hook from.

##### fn

[`HookFunction`](/api/type-aliases/hookfunction/)

The hook function to unregister.

#### Returns

`void`

#### Throws

If the hook name is invalid.
