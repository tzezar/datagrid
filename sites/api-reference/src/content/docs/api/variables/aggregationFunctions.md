---
editUrl: false
next: true
prev: true
title: "aggregationFunctions"
---

> `const` **aggregationFunctions**: `object`

Defined in: core/helpers/aggregation-functions.ts:18

A set of built-in aggregation functions.
Each function operates on an array of values and returns a calculated result.

## Type declaration

## Index Signature

\[`key`: `string`\]: [`AggregationFn`](/api/type-aliases/aggregationfn/)

| Name | Type | Defined in |
| ------ | ------ | ------ |
| <a id="count"></a> `count` | (`values`) => `number` | core/helpers/aggregation-functions.ts:28 |
| <a id="extent"></a> `extent` | (`values`) => \[`number`, `number`\] | core/helpers/aggregation-functions.ts:23 |
| <a id="max"></a> `max` | (`values`) => `number` | core/helpers/aggregation-functions.ts:22 |
| <a id="mean"></a> `mean` | (`values`) => `number` | core/helpers/aggregation-functions.ts:24 |
| <a id="median"></a> `median` | (`values`) => `number` | core/helpers/aggregation-functions.ts:25 |
| <a id="min"></a> `min` | (`values`) => `number` | core/helpers/aggregation-functions.ts:21 |
| <a id="sum"></a> `sum` | (`values`) => `number` | core/helpers/aggregation-functions.ts:20 |
| <a id="unique"></a> `unique` | (`values`) => `any`[] | core/helpers/aggregation-functions.ts:26 |
| <a id="uniquecount"></a> `uniqueCount` | (`values`) => `number` | core/helpers/aggregation-functions.ts:27 |
