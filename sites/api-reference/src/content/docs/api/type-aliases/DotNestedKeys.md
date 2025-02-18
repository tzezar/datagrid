---
editUrl: false
next: true
prev: true
title: "DotNestedKeys"
---

> **DotNestedKeys**\<`T`\>: `T` *extends* `object` ? `` { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}` } ``\[`Exclude`\<keyof `T`, `symbol`\>\] : `""` *extends* infer D ? `Extract`\<`D`, `string`\> : `never`

Defined in: core/column-creation/types.ts:4

## Type Parameters

• **T**
