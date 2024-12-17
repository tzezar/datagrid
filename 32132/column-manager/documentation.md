---
title: Column Manager
description: 
date: '2024-10-11'
published: true
---

# ColumnManager API Documentation

## Types

### PinningPosition
```typescript
type PinningPosition = 'left' | 'right' | 'none'
```

## Class: ColumnManager `<TData>`

A class that manages column operations in a data grid.

### Constructor

```typescript
constructor(grid: DatagridInstance<TData, any>)
```

### Methods

#### Column Retrieval

##### `getAccessor(columnId: ColumnId): Accessor<TData>`
Returns the accessor function for a column with the specified ID.
- **Throws**: Error if column is not found
- **Parameters**:
  - `columnId`: The unique identifier of the column

##### `getVisibleColumns(): Column<TData>[]`
Returns an array of all visible columns.

##### `getSearchableColumns(): Column<TData>[]`
Returns an array of visible columns that are marked as searchable.

#### Column Visibility

##### `hideColumn(column: Column<TData>): void`
Hides the specified column.
- **Parameters**:
  - `column`: The column to hide

##### `showColumn(column: Column<TData>): void`
Shows the specified column.
- **Parameters**:
  - `column`: The column to show

##### `toggleColumnVisibility(column: Column<TData>): void`
Toggles the visibility of the specified column.
- **Parameters**:
  - `column`: The column to toggle

#### Column Pinning

##### `changeColumnPinningPosition(column: Column<TData>, position: PinningPosition): void`
Changes the pinning position of a column.
- **Parameters**:
  - `column`: The column to modify
  - `position`: The new pinning position ('left', 'right', or 'none')

##### `refreshColumnPinningOffsets(): void`
Recalculates and updates the pinning offsets for all columns.

#### Column Sizing

##### `resizeColumn(column: Column<TData>, width: number): void`
Resizes the specified column, respecting min and max width constraints.
- **Parameters**:
  - `column`: The column to resize
  - `width`: The new width in pixels

#### Column Movement

##### `canMoveColumnLeft(column: Column<TData>): boolean`
Checks if the column can be moved left.
- **Returns**: `true` if the column can be moved left, `false` otherwise

##### `canMoveColumnRight(column: Column<TData>): boolean`
Checks if the column can be moved right.
- **Returns**: `true` if the column can be moved right, `false` otherwise

##### `moveColumnLeft(column: Column<TData>): void`
Moves the specified column one position to the left if possible.
- **Parameters**:
  - `column`: The column to move

##### `moveColumnRight(column: Column<TData>): void`
Moves the specified column one position to the right if possible.
- **Parameters**:
  - `column`: The column to move

##### `moveColumnToPosition(column: Column<TData>, position: number): void`
Moves the specified column to a specific position in the grid.
- **Parameters**:
  - `column`: The column to move
  - `position`: The target position index

#### Column Properties

##### `isFilterable(column: Column<TData>): boolean`
Checks if the column is filterable.
- **Returns**: `true` if the column is filterable, `false` otherwise
- **Parameters**:
  - `column`: The column to check

## Usage Example

```typescript
// Create a new ColumnManager instance
const columnManager = new ColumnManager(datagridInstance);

// Show/hide columns
columnManager.hideColumn(someColumn);
columnManager.showColumn(someColumn);
columnManager.toggleColumnVisibility(someColumn);

// Pin columns
columnManager.changeColumnPinningPosition(someColumn, 'left');

// Resize columns
columnManager.resizeColumn(someColumn, 200);

// Move columns
if (columnManager.canMoveColumnLeft(someColumn)) {
    columnManager.moveColumnLeft(someColumn);
}

// Get visible columns
const visibleColumns = columnManager.getVisibleColumns();

// Get searchable columns for global search
const searchableColumns = columnManager.getSearchableColumns();
```

