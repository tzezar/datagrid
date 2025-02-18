---
editUrl: false
next: true
prev: true
title: "StatusIndicatorPlugin"
---

Defined in: plugins/status-indicator.svelte.ts:20

## Implements

- `IStatusIntdicator`

## Constructors

### new StatusIndicatorPlugin()

> **new StatusIndicatorPlugin**(`config`?): [`StatusIndicatorPlugin`](/api/classes/statusindicatorplugin/)

Defined in: plugins/status-indicator.svelte.ts:28

#### Parameters

##### config?

[`StatusIndicatorPluginConfig`](/api/type-aliases/statusindicatorpluginconfig/)

#### Returns

[`StatusIndicatorPlugin`](/api/classes/statusindicatorplugin/)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="enabled"></a> `enabled` | `boolean` | plugins/status-indicator.svelte.ts:22 |
| <a id="onloadingindicatorchange"></a> `onLoadingIndicatorChange` | (`state`: [`StatusIndicatorState`](/api/type-aliases/statusindicatorstate/)) => `void` | plugins/status-indicator.svelte.ts:26 |
| <a id="position"></a> `position` | [`StatusIndicatorPosition`](/api/type-aliases/statusindicatorposition/) | plugins/status-indicator.svelte.ts:23 |
| <a id="state-2"></a> `state` | [`StatusIndicatorState`](/api/type-aliases/statusindicatorstate/) | plugins/status-indicator.svelte.ts:24 |

## Methods

### isVisible()

> **isVisible**(`target`): `boolean`

Defined in: plugins/status-indicator.svelte.ts:35

#### Parameters

##### target

[`StatusIndicatorPosition`](/api/type-aliases/statusindicatorposition/)

#### Returns

`boolean`

#### Implementation of

`IStatusIntdicator.isVisible`

***

### updateState()

> **updateState**(`state`): `void`

Defined in: plugins/status-indicator.svelte.ts:47

#### Parameters

##### state

[`StatusIndicatorState`](/api/type-aliases/statusindicatorstate/)

#### Returns

`void`

#### Implementation of

`IStatusIntdicator.updateState`
