---
title: Column alignment example
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

```ts
column definitions
```
