---
title: Pagination server side
description: Efficiently handle and display huge datasets by implementing server-side pagination, reducing load times and improving performance.
---

<script>
	import {exports} from './exports.ts'
    let {data} = $props()
</script>

# {title}

{description}

## Example

<exports.components.codePreview code={exports.datagrid.code} class="">
	<exports.datagrid.component {data} />
</exports.components.codePreview> 

### +Page.ts example

<exports.components.codeBlock code={exports.code.pageTs} class="" />