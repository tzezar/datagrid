---
title: Typescript
date: '2024-10-15'
published: true
---

Tzezar's data grid fully supports TypeScript and utilizes generics to maintain column and row
types, making your work more efficient and less prone to errors.

The first step in simplifying the process is to define your column types. This ensures type
safety during column declaration and while rendering the data grid.

```ts
import type { BaseColumn } from '$lib/datagrid/types';

type InventoryDataRow = {
	product: {
		name: string;
	};
	price: number;
};

export const columns = [
	{
		id: 'product.name',
		title: 'Product name',
		grow: true
	},
	{
		id: 'price',
		title: 'Price'
	}
] satisfies BaseColumn<InventoryDataRow>[];
```

> Make sure to pass your row type using: `satisfies BaseColumn<"YOUR_DATA_TYPE">[]`

The `BaseColumn` is a generic type that defines all the column options
available to you.

```ts
export type BaseColumn<T = unknown> = {
	id: ColumnId<T>;
	title: string;
	width?: string;
	filterType?: FilterType;
	filterValue?: FilterValue;
	options?: { value: string; label: string }[];
	sortable?: boolean;
	visible?: boolean;
	resizable?: boolean;
	moveable?: boolean;
	pinnable?: boolean;
	hideable?: boolean;
	exportable?: boolean;
	selectable?: boolean;
	grow?: boolean;
	pinned?: {
		position: 'left' | 'right';
		offset?: string | null;
	};
	align?: 'start' | 'center' | 'end';
};
```

That's it! With proper typing, you'll have IntelliSense, even for custom columns. Row types are
automatically inferred from the shape of the data you provide to the `data` property creating
datagrid instance. This will be especially useful when defining custom components or rendering
and styling custom cells.
