---
editUrl: false
next: true
prev: true
title: "ClickToCopyPlugin"
---

Defined in: plugins/click-to-copy.svelte.ts:10

## Constructors

### new ClickToCopyPlugin()

> **new ClickToCopyPlugin**(`config`?): [`ClickToCopyPlugin`](/api/classes/clicktocopyplugin/)

Defined in: plugins/click-to-copy.svelte.ts:18

#### Parameters

##### config?

[`ClickToCopyPluginConfig`](/api/type-aliases/clicktocopypluginconfig/)

#### Returns

[`ClickToCopyPlugin`](/api/classes/clicktocopyplugin/)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="display"></a> `display` | `boolean` | Displays the copy button, but only in valid cells | plugins/click-to-copy.svelte.ts:14 |
| <a id="onclicktocopy"></a> `onClickToCopy` | (`value`: `string` \| `number`) => `void` | - | plugins/click-to-copy.svelte.ts:16 |

## Methods

### addCopyFeedback()

> **addCopyFeedback**(`element`): `void`

Defined in: plugins/click-to-copy.svelte.ts:51

#### Parameters

##### element

`HTMLElement`

#### Returns

`void`

***

### handleClickToCopy()

> **handleClickToCopy**(`row`, `column`): `void`

Defined in: plugins/click-to-copy.svelte.ts:41

#### Parameters

##### row

`any`

##### column

`any`

#### Returns

`void`

***

### isValidColumn()

> **isValidColumn**(`column`): `column is any`

Defined in: plugins/click-to-copy.svelte.ts:29

#### Parameters

##### column

`ColumnDef`\<`any`\>

#### Returns

`column is any`

***

### shouldDisplayCopyButton()

> **shouldDisplayCopyButton**(`column`): `boolean`

Defined in: plugins/click-to-copy.svelte.ts:23

#### Parameters

##### column

`any`

#### Returns

`boolean`
