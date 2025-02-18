---
editUrl: false
next: true
prev: true
title: "megadrive"
---

> **megadrive**(`options`): `Promise`\<`void`\>

Defined in: test.ts:20

A shortcut method for Nostalgist.launch method, with some additional default options
for Sega Genesis / Megadrive emulation.

It will use `genesis_plus_gx` as the default core for emulation.

## Parameters

### options

`any`

The ROM file or options for emulation.
If the options is a string or `File` or an object with `fileName` and `fileContent` properties, it will be treated as `{ rom: options }`.
If the options is an object, it will be passed directly as options to `Nostalgist.launch`.

## Returns

`Promise`\<`void`\>

A promise that resolves when the emulation is started.

## Example

```ts
// Basic usage
await Nostalgist.megadrive('30yearsofnintendont.bin');

// Equivalent to:
await Nostalgist.launch({ core: 'genesis_plus_gx', rom: '30yearsofnintendont.bin' });
```
