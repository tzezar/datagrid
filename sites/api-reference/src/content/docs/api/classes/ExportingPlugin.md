---
editUrl: false
next: true
prev: true
title: "ExportingPlugin"
---

Defined in: plugins/exporting.svelte.ts:16

## Type Parameters

• **T** = `any`

## Constructors

### new ExportingPlugin()

> **new ExportingPlugin**\<`T`\>(`datagrid`, `config`?): [`ExportingPlugin`](/api/classes/exportingplugin/)\<`T`\>

Defined in: plugins/exporting.svelte.ts:23

#### Parameters

##### datagrid

`DatagridCore`\<`T`\>

##### config?

[`ExportingPluginConfig`](/api/type-aliases/exportingpluginconfig/)

#### Returns

[`ExportingPlugin`](/api/classes/exportingplugin/)\<`T`\>

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="datagrid-1"></a> `datagrid` | `DatagridCore`\<`T`\> | plugins/exporting.svelte.ts:17 |
| <a id="exportmethods"></a> `exportMethods` | [`ExportMethods`](/api/type-aliases/exportmethods/)[] | plugins/exporting.svelte.ts:19 |
| <a id="filename"></a> `fileName` | `string` | plugins/exporting.svelte.ts:21 |

## Methods

### exportToCSV()

> **exportToCSV**(): `void`

Defined in: plugins/exporting.svelte.ts:42

Exports data to CSV format using PapaParse

#### Returns

`void`

***

### exportToExcel()

> **exportToExcel**(): `void`

Defined in: plugins/exporting.svelte.ts:52

Exports data to Excel format using XLSX

#### Returns

`void`

***

### exportToJSON()

> **exportToJSON**(): `void`

Defined in: plugins/exporting.svelte.ts:33

Exports data to JSON format and triggers download

#### Returns

`void`

***

### exportToXML()

> **exportToXML**(): `void`

Defined in: plugins/exporting.svelte.ts:63

Exports data to XML format using fast-xml-parser

#### Returns

`void`
