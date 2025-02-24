---
title: Column Creation
---

<script>
  import { exports } from './exports.ts'
</script>

# {title}

If you've used the beta version, you might have noticed that defining columns has been revamped. We’ve made it easier and more flexible by moving to column creators. This reduces the need for manually defining multiple values, offers better flexibility, and, when combined with lifecycle hooks, gives you **full control** over the appearance and behavior of your columns.

## Types of Columns

> For a detailed reference of each column, check the [API Reference](https://datagrid-api-reference.tzezar.pl/).

There are four main types of columns, each designed for different use cases. Let’s walk through the key differences, use cases, and what each one can do.

### 1. accessorColumn

This is used for columns that pull in real data from the grid.

**What you need to know:**
- **`accessorKey`** – This is the key used to grab values from a row. It can even be nested (e.g., `'price.retail'`). It automatically generates a `getValueFn` function, optimizing performance.
  
If you need custom logic, you can override `getValueFn`, which gives you full control over how data is accessed or transformed (e.g., cleaning or changing the data).

If you're just formatting the final output, use `formatterFn` instead.

**Other features:**
- **`getGroupValueFn`** – Define custom grouping logic here.
- **`aggregate`** – Decide how child values should be aggregated when grouped.
- **`cell`** – By default, the cell just displays the value. You can create a custom cell (e.g., a Svelte component, inline string, or HTML).
- **`aggregatedCell`** – How the aggregated value should appear in a cell.
- **`groupedCell`** – How cells should appear when grouped.
- **`headerCell`** – Define the appearance of the column header.

**Configuration options**  
Columns can be configured to be `sortable`, `filterable`, and more—check out the API for the full list.

- **`align`** – We've included this by default because it’s a common need. It controls the alignment of the column.
- **`state`** – Columns are treated like data, so they can have internal state (e.g., `size`, `visibility`, and `pinning`).
- **`_meta`** – This is where you can add custom values like functions, state, or configurations. You can also type it by passing a second generic parameter, for example, `AccessorColumn<TDataType, TMeta>`.

### 2. `computedColumn`

This column type is similar to `accessorColumn` but is used when you want to display a value that combines multiple column values.

**Important to note:**
- The value **isn’t cached**, which can impact performance, especially with large datasets (like sorting, which is heavily optimized in the grid). This may cause issues when dealing with 100,000+ rows.

> If performance is bad, my workaround for this is to precompute those values and use `accessorColumn` instead. It might not fit every scenario.


### 3. `displayColumn`

Use this for columns that display content that’s not directly related to the grid data.

**Restrictions:**
- Cannot be `searchable`, `groupable`, `sortable`, `filterable`, or have faceted values calculated.

### 4. `columnGroup`

Also called a header group, this allows you to group columns together and create a hierarchical structure.

**Key features:**
- Groups can be collapsed or moved.
  
**Limitations:**
- The size is based on the dimensions of the leaf columns and their children. It can’t be directly controlled.
- Pinning isn’t supported yet.
- It can’t be `searchable`, `groupable`, `sortable`, `filterable`, `pinnable`, or `resizable`.

### Column Definition (`ColumnDef<T>`)

All the above column types are wrapped into a `ColumnDef<T>`.  
Columns that are rendered (e.g., `accessorColumn`, `displayColumn`, `computedColumn`) are called `LeafColumn<T>`.

## Column Initialization and Lifecycle

Once columns are passed into the data grid, they are modified slightly:
- A `parentId` is added (needed for header grouping).
- Default size is applied.

At this stage, you can use the `PRE_PROCESS_ORIGINAL_COLUMNS` hook to manipulate them.

The columns are stored in `datagrid.originalState.columns`, and you can apply `POST_PROCESS_ORIGINAL_COLUMNS` if you need to process them further.

These are the original columns. The data grid operates on the `_columns` property, which gets initialized shortly afterward (check the data grid constructor). The original columns remain untouched.

Subsequent column initialization mainly affects their order (in the case of grouping) or adds properties. For the latest state, check the API.

Before and after this initialization, you can use two hooks:  
- `PRE_PROCESS_COLUMNS`
- `POST_PROCESS_COLUMNS`

## Using Columns

You can interact with columns using `datagrid.column.method`. There are helper methods that help you access columns, find leaf columns, and even deal with group columns easily.
