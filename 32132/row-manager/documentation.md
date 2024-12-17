---
title: Column Manager
description: 
date: '2024-10-11'
published: true
---

# ColumnManager API

The `ColumnManager` class provides methods for managing columns in a data grid, including visibility, pinning position, resizing, and ordering. This API reference explains each method and its use.

## Methods

### `getAccessor(columnId: ColumnId): Accessor<TData>`

- **Description**: Returns the accessor function for a specified column ID.
- **Parameters**:
  - `columnId`: The unique identifier for the column.
- **Returns**: `Accessor<TData>`

### `hideColumn(column: Column<TData>): void`

- **Description**: Hides the specified column.
- **Parameters**:
  - `column`: The column object to hide.

### `showColumn(column: Column<TData>): void`

- **Description**: Shows the specified column.
- **Parameters**:
  - `column`: The column object to show.

### `toggleColumnVisibility(column: Column<TData>): void`

- **Description**: Toggles the visibility of the specified column.
- **Parameters**:
  - `column`: The column object to toggle.

### `changeColumnPinningPosition(column: Column<TData>, position: PinningPosition): void`

- **Description**: Changes the pinning position of the specified column.
- **Parameters**:
  - `column`: The column object to modify.
  - `position`: A `PinningPosition` value (`'left' | 'right' | 'none'`).

### `resizeColumn(column: Column<TData>, width: number): void`

- **Description**: Resizes the specified column within its minimum and maximum width constraints.
- **Parameters**:
  - `column`: The column object to resize.
  - `width`: The new width for the column.

### `moveColumnLeft(column: Column<TData>): void`

- **Description**: Moves the column one position to the left if possible.

### `moveColumnRight(column: Column<TData>): void`

- **Description**: Moves the column one position to the right if possible.

### `moveColumnToPosition(column: Column<TData>, position: number): void`

- **Description**: Moves the column to a specified position index.

### `getVisibleColumns(): Column<TData>[]`

- **Description**: Returns an array of currently visible columns.
- **Returns**: Array of `Column<TData>`

### `isFilterable(column: Column<TData>): boolean`

- **Description**: Checks if the specified column is filterable.
- **Returns**: `boolean`

### `getSearchableColumns(): Column<TData>[]`

- **Description**: Returns an array of columns that are both visible and searchable.
- **Returns**: Array of `Column<TData>`
