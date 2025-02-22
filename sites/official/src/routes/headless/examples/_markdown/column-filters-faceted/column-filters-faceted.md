---
title: Faceted column filters
description: 
---

<script>
	import {exports} from './exports.ts'
</script>

# {title}

{description}

## Example

<exports.components.codePreview code={exports.datagrid.code} class="">
	<exports.datagrid.component />
</exports.components.codePreview> 

## Key Points

1. **Calculating Facets**:  

	Facets can be calculated per column by setting

    ```ts
    options: {
        calculateFacets: true
    },
    ```

2. **How To Use Facets**:

    Check `<ColumnFiltersInput />` for example implementation

    