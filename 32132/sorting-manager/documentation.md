---
title: Column Manager
description: 
date: '2024-10-11'
published: true
---


# Svelte Datagrid Documentation

## Table of Contents
- [Features](#features)
  - [Column Manager](#column-manager)
  - [Filtering Manager](#filtering-manager)
  - [Grouping Manager](#grouping-manager)

## Features

### Column Manager

The Column Manager handles all column-related operations in the datagrid.

#### Types

```typescript
type PinningPosition = 'left' | 'right' | 'none'

interface Column<TData> {
  columnId: ColumnId;
  accessor: Accessor<TData>;
  visible: boolean;
  filterable?: boolean;
  searchable?: boolean;
  pinning: {
    position: PinningPosition;
    offset: number;
  };
  size: {
    width: number;
    minWidth: number;
    maxWidth: number;
  };
}
```

#### Methods

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `getAccessor` | `columnId: ColumnId` | `Accessor<TData>` | Returns the accessor function for a column |
| `hideColumn` | `column: Column<TData>` | `void` | Hides the specified column |
| `showColumn` | `column: Column<TData>` | `void` | Shows the specified column |
| `toggleColumnVisibility` | `column: Column<TData>` | `void` | Toggles column visibility |
| `changeColumnPinningPosition` | `column: Column<TData>, position: PinningPosition` | `void` | Changes column pinning position |
| `resizeColumn` | `column: Column<TData>, width: number` | `void` | Resizes a column |
| `moveColumnLeft` | `column: Column<TData>` | `void` | Moves column one position left |
| `moveColumnRight` | `column: Column<TData>` | `void` | Moves column one position right |
| `moveColumnToPosition` | `column: Column<TData>, position: number` | `void` | Moves column to specific position |
| `getVisibleColumns` | - | `Column<TData>[]` | Returns array of visible columns |
| `getSearchableColumns` | - | `Column<TData>[]` | Returns array of searchable columns |

### Filtering Manager

The Filtering Manager handles data filtering operations.

#### Types

```typescript
type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'between'
  | 'inList'
  | 'notInList'
  | 'empty'
  | 'notEmpty';

interface FilterCondition<TData> {
  columnId: ColumnId;
  accessor: Accessor<TData>;
  operator: FilterOperator;
  value: any;
  valueTo?: any;
}

interface SearchState {
  value: string;
  fuzzy: boolean;
  delay: number;
}
```

#### Methods

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `addFilter` | `condition: FilterCondition<TData>` | `void` | Adds a new filter condition |
| `removeFilter` | `accessorKey: string` | `void` | Removes filter for specified column |
| `clearFilters` | - | `void` | Clears all filters |
| `isRowMatching` | `row: any` | `boolean` | Checks if row matches current filters |
| `initializeFuseInstance` | `items: T[], keys: string[]` | `Fuse<T>` | Initializes fuzzy search instance |

### Grouping Manager

The Grouping Manager handles data grouping operations.

#### Types

```typescript
type AggregationFn = 
  | "none" 
  | 'sum' 
  | 'min' 
  | 'max' 
  | 'extent' 
  | 'mean' 
  | 'median' 
  | 'unique' 
  | 'uniqueCount' 
  | 'count' 
  | 'all'

interface Group {
  columnId: ColumnId;
  accessor: (row: any) => any;
}

interface GroupData {
  items: any[];
  allItems: any[];
  subgroups: Map<string, any>;
  groupPath: string;
  value: any;
  columnId: ColumnId;
  depth: number;
  aggregates: any;
}
```

#### Methods

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `setGroupBy` | `groupBy: Group[]` | `void` | Sets grouping columns |
| `isGroupExpanded` | `groupId: string` | `boolean` | Checks if group is expanded |
| `hasGroups` | - | `boolean` | Checks if any grouping is applied |
| `calculateGroupAggregates` | `group: any` | `any` | Calculates group aggregations |

## Usage Examples

### Column Management

```typescript
// Initialize column manager
const grid = new DatagridInstance<YourDataType>();
const columnManager = new ColumnManager(grid);

// Hide/Show columns
columnManager.hideColumn(column);
columnManager.showColumn(column);

// Pin columns
columnManager.changeColumnPinningPosition(column, 'left');

// Resize columns
columnManager.resizeColumn(column, 200);
```

### Filtering

```typescript
// Initialize filtering manager
const filteringManager = new FilteringManager(grid);

// Add a filter
filteringManager.addFilter({
  columnId: 'name',
  accessor: (row) => row.name,
  operator: 'contains',
  value: 'John'
});

// Clear filters
filteringManager.clearFilters();
```

### Grouping

```typescript
// Initialize grouping manager
const groupingManager = new GroupingManager(grid);

// Set grouping
groupingManager.setGroupBy([
  {
    columnId: 'category',
    accessor: (row) => row.category
  }
]);

// Check if group is expanded
const isExpanded = groupingManager.isGroupExpanded('groupId');
```