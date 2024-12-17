---
title:
description:
date: '2024-10-11'
published: true
---

# Column Processor API Reference

This documentation covers the column processing functionality for the data grid component.

## Table of Contents

## Types

### Column Definition
The `Column` type represents a column in the data grid with its configuration and behavior.

```typescript
type Column<TData, TCustomKeys extends string = never> = {
    columnId: string
    accessor: (data: TData) => any
    cell?: {
        component?: any
        style?: (row: any) => any
    }
    pinning: {
        position: 'left' | 'right' | 'none'
        offset: number
    }
    align: "start" | "center" | "end"
    isSorted: () => boolean
    getSortingDirection: () => 'asc' | 'desc' | undefined
    aggregationFn: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'none'
    columnDef: ColumnDef<TData, TCustomKeys>
}
```

### Facets
The data grid supports two types of facets for column data analysis:

```typescript
type NumericFacet = {
    type: 'numeric'
    min: number
    max: number
}

type CategoricalFacet = {
    type: 'categorical'
    uniqueValues: any[]
    uniqueValuesCount: number
}
```

## ColumnProcessor Class

### Constructor

```typescript
constructor(grid: DatagridInstance<TData, any>)
```

Creates a new instance of the ColumnProcessor class.

### Methods

#### transform()
Transforms the raw column definitions into processed columns with all necessary properties and behaviors.

```typescript
transform(): void
```

Key functionalities:
- Creates accessor functions for data retrieval
- Sets up sorting behavior
- Configures column pinning
- Applies default values for column properties

#### calculateFacets(rows)
Calculates faceting information for columns that have faceting enabled.

```typescript
calculateFacets(rows: Row<TData>[]): void
```

Parameters:
- `rows`: Array of data grid rows to analyze

For numeric facets:
- Calculates minimum and maximum values
- Updates the column's faceting configuration

For categorical facets:
- Determines unique values
- Counts number of unique values

## Column Properties

### Core Properties
- `columnId`: Unique identifier for the column
- `header`: Column header content
- `accessor`: Function to access data from the row
- `align`: Text alignment ("start" | "center" | "end")

### Formatting and Display
- `formatter`: Custom formatting function
- `cell.component`: Custom cell rendering component
- `cell.style`: Custom cell styling function

### Behavior Flags
- `sortable`: Enable/disable sorting (default: true)
- `resizable`: Enable/disable resizing (default: true)
- `movable`: Enable/disable moving (default: true)
- `pinnable`: Enable/disable pinning (default: true)
- `hideable`: Enable/disable hiding (default: true)
- `searchable`: Enable/disable searching (default: true)
- `filterable`: Enable/disable filtering (default: true)
- `groupable`: Enable/disable grouping (default: true)
- `visible`: Show/hide column (default: true)

### Sizing
```typescript
size: {
    width: number     // default: 100
    minWidth: number  // default: 50
    maxWidth: number  // default: 200
    grow: boolean     // default: false
}
```

## Usage Example

```typescript
import type { ColumnDef } from './types';

const columns: ColumnDef<MyDataType>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        pinning: 'left',
        faceting: {
            type: 'categorical'
        }
    },
    {
        accessorKey: 'age',
        header: 'Age',
        faceting: {
            type: 'numeric'
        },
        aggregationFn: 'avg'
    }
];

const grid = new DatagridInstance(columns, data);
const processor = new ColumnProcessor(grid);
processor.transform();
```