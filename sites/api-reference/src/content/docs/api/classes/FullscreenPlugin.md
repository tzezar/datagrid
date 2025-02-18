---
editUrl: false
next: true
prev: true
title: "FullscreenPlugin"
---

Defined in: plugins/fullscreen.svelte.ts:7

## Constructors

### new FullscreenPlugin()

> **new FullscreenPlugin**(`config`?): [`FullscreenPlugin`](/api/classes/fullscreenplugin/)

Defined in: plugins/fullscreen.svelte.ts:14

#### Parameters

##### config?

[`FullscreenPluginConfig`](/api/type-aliases/fullscreenpluginconfig/)

#### Returns

[`FullscreenPlugin`](/api/classes/fullscreenplugin/)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="displayfullscreentogglebutton"></a> `displayFullscreenToggleButton` | `boolean` | plugins/fullscreen.svelte.ts:10 |
| <a id="fullscreenmodeenabled"></a> `fullscreenModeEnabled` | `boolean` | plugins/fullscreen.svelte.ts:9 |
| <a id="onfullscreenchange"></a> `onFullscreenChange` | (`config`: [`FullscreenPluginConfig`](/api/type-aliases/fullscreenpluginconfig/)) => `void` | plugins/fullscreen.svelte.ts:12 |

## Methods

### isFullscreenModeEnabled()

> **isFullscreenModeEnabled**(): `boolean`

Defined in: plugins/fullscreen.svelte.ts:25

#### Returns

`boolean`

***

### toggleFullscreen()

> **toggleFullscreen**(): `void`

Defined in: plugins/fullscreen.svelte.ts:19

#### Returns

`void`
