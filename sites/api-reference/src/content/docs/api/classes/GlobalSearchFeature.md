---
editUrl: false
next: true
prev: true
title: "GlobalSearchFeature"
---

Defined in: core/features/global-search.svelte.ts:39

The GlobalSearchFeature class provides search capabilities within the datagrid,
including fuzzy search and manual query management.

## Implements

- [`IGlobalSearchState`](/api/interfaces/iglobalsearchstate/)

## Constructors

### new GlobalSearchFeature()

> **new GlobalSearchFeature**(`datagrid`, `config`): [`GlobalSearchFeature`](/api/classes/globalsearchfeature/)

Defined in: core/features/global-search.svelte.ts:61

Creates an instance of the GlobalSearchFeature.

#### Parameters

##### datagrid

[`DatagridCore`](/api/classes/datagridcore/)

The datagrid instance to associate with the search feature.

##### config

`Partial`

Configuration options for initializing the feature.

#### Returns

[`GlobalSearchFeature`](/api/classes/globalsearchfeature/)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="datagrid-1"></a> `datagrid` | [`DatagridCore`](/api/classes/datagridcore/) | - | core/features/global-search.svelte.ts:40 |
| <a id="debouncedelay"></a> `debounceDelay` | `any` | The debounce delay in milliseconds for search query input. | core/features/global-search.svelte.ts:47 |
| <a id="fusesearchengine"></a> `fuseSearchEngine` | `any` | The instance of Fuse.js used for search. | core/features/global-search.svelte.ts:51 |
| <a id="isfuzzysearchenabled"></a> `isFuzzySearchEnabled` | `any` | Whether fuzzy search is enabled. | core/features/global-search.svelte.ts:49 |
| <a id="ismanual"></a> `isManual` | `boolean` | Whether the search is manual. | core/features/global-search.svelte.ts:43 |
| <a id="onsearchquerychange"></a> `onSearchQueryChange` | (`value`: `string`) => `void` | Callback function triggered when the search query changes. | core/features/global-search.svelte.ts:54 |
| <a id="searchquery"></a> `searchQuery` | `any` | The current search query string. | core/features/global-search.svelte.ts:45 |

## Methods

### getFuseSearchEngine()

> **getFuseSearchEngine**(): `any`

Defined in: core/features/global-search.svelte.ts:100

Retrieves the Fuse.js search engine instance. If not yet initialized, it initializes it.

#### Returns

`any`

The Fuse.js instance used for search, or null if not initialized.

***

### initializeFuseInstance()

> **initializeFuseInstance**\<`T`\>(`items`, `keys`, `config`?): `Fuse`\<`T`\>

Defined in: core/features/global-search.svelte.ts:88

Initializes a new Fuse.js instance with the provided items and search keys.
This is used to set up the search functionality for the given data.

#### Type Parameters

• **T**

#### Parameters

##### items

`T`[]

The array of items to search through.

##### keys

`string`[]

The keys within each item to search on.

##### config?

`IFuseOptions`\<`T`\> = `DEFAULT_FUSE_OPTIONS`

The configuration options for Fuse.js.

#### Returns

`Fuse`\<`T`\>

The initialized Fuse.js instance configured with search options.

***

### setFuseSearchEngine()

> **setFuseSearchEngine**(`fuseSearchEngine`): `void`

Defined in: core/features/global-search.svelte.ts:111

Sets the Fuse.js search engine instance for use in searching.

#### Parameters

##### fuseSearchEngine

`any`

The Fuse.js instance to set, or null to disable search.

#### Returns

`void`

***

### updateSearchQuery()

> **updateSearchQuery**(`query`): `void`

Defined in: core/features/global-search.svelte.ts:71

Updates the current search query and triggers the search functionality.
Emits an event to notify other components of the query change.

#### Parameters

##### query

`string`

The new search query.

#### Returns

`void`
