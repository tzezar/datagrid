---
title: Column filters
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

1. **TMeta Generic for Better IntelliSense**:  

	You can pass an additional type to `ColumnDef<InventoryItem, YOUR_TYPE>[]` to enhance IntelliSense support for the `_meta` field.

2. **Using `_meta` for Custom Data**:  

	The `_meta` field allows you to pass any custom data while keeping it fully typed.

3. **Checking If a Column is Filterable**:

	You can determine if a column is filterable by accessing its options: `column.options.filterable`

4. **Choosing Which Filters to Render**:

	`datagrid` does not enforce a specific way to determine which filters to render.  
	For example, you can use the `_meta` field like this:  

	```ts
	_meta: {
		filterType: 'range'
	}
	```

	This is just an example—you can use any structure that suits your needs.

5.	**Passing Options For Select**:

	I found it easy to pass options in this way, again it's up to you.

	```ts
	filterOptions: [
		{ label: 'Computers', value: 'Computers' },
		{ label: 'Clothing', value: 'clothing' }
	]
	```



