---
editUrl: false
next: true
prev: true
title: "StripedRowsPlugin"
---

Defined in: plugins/striped-rows.svelte.ts:14

## Implements

- `IStripedRows`

## Constructors

### new StripedRowsPlugin()

> **new StripedRowsPlugin**(`config`?): [`StripedRowsPlugin`](/api/classes/stripedrowsplugin/)

Defined in: plugins/striped-rows.svelte.ts:17

#### Parameters

##### config?

[`StripedRowsPluginConfig`](/api/type-aliases/stripedrowspluginconfig/)

#### Returns

[`StripedRowsPlugin`](/api/classes/stripedrowsplugin/)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="enabled"></a> `enabled` | `boolean` | plugins/striped-rows.svelte.ts:15 |

## Methods

### changeEnabled()

> **changeEnabled**(`state`): `void`

Defined in: plugins/striped-rows.svelte.ts:47

#### Parameters

##### state

`boolean`

#### Returns

`void`

***

### disable()

> **disable**(): `void`

Defined in: plugins/striped-rows.svelte.ts:37

#### Returns

`void`

***

### enable()

> **enable**(): `void`

Defined in: plugins/striped-rows.svelte.ts:40

#### Returns

`void`

***

### getClasses()

> **getClasses**(`row`, `rowIndex`): `string`

Defined in: plugins/striped-rows.svelte.ts:25

#### Parameters

##### row

`GridBasicRow`\<`any`\>

##### rowIndex

`number`

#### Returns

`string`

#### Implementation of

`IStripedRows.getClasses`

***

### initialize()

> **initialize**(`config`?): `void`

Defined in: plugins/striped-rows.svelte.ts:21

#### Parameters

##### config?

[`StripedRowsPluginConfig`](/api/type-aliases/stripedrowspluginconfig/)

#### Returns

`void`

***

### isEnabled()

> **isEnabled**(): `boolean`

Defined in: plugins/striped-rows.svelte.ts:51

#### Returns

`boolean`

***

### toggle()

> **toggle**(): `void`

Defined in: plugins/striped-rows.svelte.ts:43

#### Returns

`void`
