---
title: Row identifiers
---

<script>
	import {exports} from './exports.ts'
</script>

# {title}

## Custom Row Identifiers in DatagridCore
Some core functionalities within DatagridCore assume a default way of identifying rows — specifically, using row.id.

However, this may not always be the case. In many datasets, the unique key for a row may be found in a different field or even constructed from multiple fields.

To handle this scenario, DatagridCore allows you to override the default row identifier behavior by providing a custom rowIdGetter function in the config.

### The `rowIdGetter` Function


<exports.components.codeBlock code={exports.code.rowIdGetter1} class="" />

This function lets you define how each row should be uniquely identified.



### Example: Using a Custom Row Identifier

<exports.components.codeBlock code={exports.code.rowIdGetter2} class="" />

In the example above, rows are uniquely identified using a combination of the name and category fields.


> ⚠️ **Important:**<br>
> Ensure that your `rowIdGetter` function always returns a **unique** and **stable** identifier for each row. This is critical for correct selection, updating, and internal tracking within the datagrid.

## API Reference

For a complete list of available methods and usage details, refer to the API Reference documentation.
