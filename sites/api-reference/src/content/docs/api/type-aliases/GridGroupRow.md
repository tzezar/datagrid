---
editUrl: false
next: true
prev: true
title: "GridGroupRow"
---

> **GridGroupRow**\<`TOriginalRow`\>: `object`

Defined in: core/types.ts:66

## Type Parameters

• **TOriginalRow**

## Type declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| <a id="aggregations"></a> `aggregations` | [`Aggregation`](/api/type-aliases/aggregation/)[] | core/types.ts:73 |
| <a id="children"></a> `children` | [`GridRow`](/api/type-aliases/gridrow/)\<`TOriginalRow`\>[] | core/types.ts:72 |
| <a id="depth"></a> `depth` | `number` | core/types.ts:71 |
| <a id="groupkey"></a> `groupKey` | `string` | core/types.ts:69 |
| <a id="groupvalue"></a> `groupValue` | `any`[] | core/types.ts:70 |
| <a id="identifier"></a> `identifier` | [`GridGroupRowIdentifier`](/api/type-aliases/gridgrouprowidentifier/) | core/types.ts:68 |
| <a id="index"></a> `index` | `string` | core/types.ts:67 |
| <a id="isexpanded"></a> `isExpanded` | () => `boolean` | core/types.ts:74 |
| <a id="isgrouprow"></a> `isGroupRow` | () => `this is GridGroupRow<TOriginalRow>` | core/types.ts:75 |
