---
title: Column sizing example
description:
date: '2025-02-05'
published: true
---

<script lang='ts'>
 	import Datagrid from './datagrid.svelte';
	import datagridCode from './datagrid.svelte?raw';
	let {data} = $props();
</script>

<Datagrid data={data.inventory} />

<br/>

Well, basically it is out of the box, you can change column pinning in column header dropdown menu or in control center.

```ts
column definitions
```
