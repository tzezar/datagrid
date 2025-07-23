---
title: Getting Started with Tzezar's Datagrid
---

<script>
import BasicDatagrid from './basic-datagrid.svelte';
import BasicDatagridFixed from './basic-datagrid-fixed.svelte';
import { inventoryData as data } from '$lib/data/data-storage.svelte';
import {exports} from './exports.ts'
</script>

# {title}

Welcome to the quick start guide for Tzezar's Datagrid Core! This guide will help you rapidly implement the headless version of the datagrid in your project.

## Quick Overview

Tzezar's Datagrid Core provides a flexible, headless implementation that lets you build powerful data tables without being constrained by specific UI frameworks. This guide covers:

1. Setting up your data
2. Defining columns
3. Creating a datagrid instance
4. Rendering your datagrid

Let's get started!

## 1. Setting Up Your Data

Every datagrid needs data to display. Here's a simple example:


<exports.components.codeBlock code={exports.code.example1} class="" />



## 2. Defining Columns

Columns define how your data is structured and displayed:

<exports.components.codeBlock code={exports.code.example2} class="" />


### Column Types Explained

1. `accessorColumn`: Displays data directly from your objects
2. `computedColumn`: Combines or transforms data from multiple fields
3. `displayColumn`: Shows custom content not tied to your data
4. `columnGroup`: Organizes columns into logical groups

> Tip: Add `satisfies ColumnDef<InventoryItem>[]` to get TypeScript IntelliSense support.

## 3. Creating a Datagrid Instance

Now that you have data and columns, create your datagrid:

<exports.components.codeBlock code={exports.code.example3} class="" />


### Customizing Your Datagrid

For basic needs, this configuration is sufficient. For more control, you can:

1. Set an initial state:

<exports.components.codeBlock code={exports.code.example4} class="" />

2. Extend built-in features:

<exports.components.codeBlock code={exports.code.example5} class="" />

## 4. Rendering Your Datagrid

Since this is a headless library, you have complete freedom over rendering. Here's a basic implementation using `<div>` elements:

<exports.components.codeBlock code={exports.code.example6} lang='svelte' class="" />


### Using Custom Cell Rendering

For more complex cell content, you can use Svelte 5 snippets: 

<exports.components.codeBlock code={exports.code.example7} lang='svelte' class="" />


or prebuilt component:

<exports.components.codeBlock code={exports.code.example8} lang='svelte'  class="" />

Built-in `<RenderCell />` component makes rendering custom cell content straightforward.

### Why Use `<div>` Instead of `<table>`?

While traditional HTML tables work for simple cases, `<div>`-based structures offer significant advantages:

1. Better styling flexibility with CSS Grid and Flexbox
2. Improved performance for large datasets through virtual scrolling
3. Custom scroll behavior for features like sticky headers
4. More control over column resizing and reordering
5. Better integration with modern JavaScript frameworks

## Next Steps

Congratulations on setting up your first Tzezar's Datagrid! From here, you can:

1. Explore the API reference for detailed documentation
2. Check out examples for common patterns and advanced usage.
3. Try the Enhanced Datagrid if you need a ready-made component with built-in UI and some abstraction layer

## Advanced Features

Tzezar's Datagrid Core comes with powerful features you can tap into:

<exports.components.codeBlock code={exports.code.example9} class="" />

---

<br/>

Ready to build powerful, flexible data grids? Dive deeper into the documentation or check out the examples to see what Tzezar's Datagrid can do for your project!
