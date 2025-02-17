---
editUrl: false
next: true
prev: true
title: "AnimationsPlugin"
---

Defined in: plugins/animations.svelte.ts:9

## Constructors

### new AnimationsPlugin()

> **new AnimationsPlugin**(`datagrid`, `config`?): [`AnimationsPlugin`](/api/classes/animationsplugin/)

Defined in: plugins/animations.svelte.ts:15

#### Parameters

##### datagrid

`DatagridCore`

##### config?

[`AnimationsPluginConfig`](/api/type-aliases/animationspluginconfig/)

#### Returns

[`AnimationsPlugin`](/api/classes/animationsplugin/)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="animateheaders"></a> `animateHeaders` | `boolean` | plugins/animations.svelte.ts:11 |
| <a id="animaterows"></a> `animateRows` | `boolean` | plugins/animations.svelte.ts:12 |
| <a id="animationduration"></a> `animationDuration` | `number` | plugins/animations.svelte.ts:13 |
| <a id="datagrid-1"></a> `datagrid` | `DatagridCore` | plugins/animations.svelte.ts:10 |

## Methods

### getHeadersFlipDuration()

> **getHeadersFlipDuration**(`len`): `number`

Defined in: plugins/animations.svelte.ts:44

#### Parameters

##### len

`number`

#### Returns

`number`

***

### getRowsFlipDuration()

> **getRowsFlipDuration**(`len`): `number`

Defined in: plugins/animations.svelte.ts:48

#### Parameters

##### len

`number`

#### Returns

`number`

***

### initialize()

> **initialize**(`config`?): `void`

Defined in: plugins/animations.svelte.ts:20

#### Parameters

##### config?

[`AnimationsPluginConfig`](/api/type-aliases/animationspluginconfig/)

#### Returns

`void`

***

### shouldAnimateHeaders()

> **shouldAnimateHeaders**(): `boolean`

Defined in: plugins/animations.svelte.ts:36

#### Returns

`boolean`

***

### shouldAnimateRows()

> **shouldAnimateRows**(): `boolean`

Defined in: plugins/animations.svelte.ts:40

#### Returns

`boolean`
