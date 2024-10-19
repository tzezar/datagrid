---
title: Customization
date: '2024-10-15'
published: true
---

<script>
  import Datagrid from './datagrid.svelte'
</script>

When creating this datagrid, I aimed to combine ease of use with ease of customization.

The datagrid follows the shadcn philosophy – you get a component that you can freely edit and change every part of, thanks to having the full source code. The predefined components are stylable using snippets and by styling with class.

As I mentioned, every component can be customized for your needs, but the datagrid provides several snippets to make it easier to work with and customize for the most common use cases.

> Don’t be misled – you don’t have to use them. You can render your own UI entirely. The datagrid (though not yet fully tested) should function headlessly, providing only internal logic. If you want to implement your own components, just see how I did it and build your own UI!

## Snippets

`Datagrid.Datagrid` provides the following snippets:

```ts
head?: Snippet;
loadingIndicator?: Snippet;
dataIndicator?: Snippet;
body?: Snippet;
topBar?: Snippet;
footer?: Snippet;
children?: Snippet;
pagination?: Snippet;
```

By default, passing components to `children()` allows you to render whatever you want while retaining some base styles and logic, such as text scaling.

> See the `mobile` example for more details.

## Customowe komponenty

You can freely edit components and add your own functionality in a relatively simple way. See how it’s implemented and modify the code to fit your use case.

## Custom cell

Use the excellent Svelte template system:

```svelte
// body
{#if column.id === 'price'}
	<Datagrid.CellWithoutSpacing {...props}>Custom content</Datagrid.CellWithoutSpacing>
{:else if column.id === 'quantity'}
	<Datagrid.Cell {...props}>
		{getNestedValue(row, column.id)}
	</Datagrid.Cell>
{:else}
	<Datagrid.Cell {...props} class={{ data: 'bg-red-400' }} />
{/if}
```

## Custom header

Similar to the above:

```svelte
// head
{#if column.id === 'price'}
	<Datagrid.Header {column}>
		{column.title}
	</Datagrid.Header>
{:else}
	<Datagrid.Header {column} />
{/if}
```

## Custom column

Just define a column inside `columns`:

```ts
import type { BaseColumn } from '$lib/datagrid/types';
import type { InventoryDataRow } from '$lib/data/inventory';

export const columns = [
	{
		id: 'additionalColumn',
		title: 'Additional Column'
	}
] satisfies BaseColumn<InventoryDataRow>[];
```

You can then render it as shown above, for example:

```svelte
// head
{#if column.id === 'additionalColumn'}
	<Datagrid.Header {column}>Hello There</Datagrid.Header>
{:else}
	...
{/if}
```

```svelte
// body
{#if column.id === 'additionalColumn'}
	<Datagrid.Cell {...props}>General Kenobi</Datagrid.Cell>
{:else}
	...
{/if}
```

## Styling

Basic datagrid components like  `cell`, `row`, `datagrid`, `header`, `head` etc., support styling by passing `class`.

For example, you can style`Datagrid.Datagrid` or `Datagrid.Row` like this:

```ts
<Datagrid.Datagrid class={{wrapper: 'max-h-[400px]', content: 'bg-red-400'}}>
```

```ts
<Datagrid.Row class="flex-col">
```

> Everything is typed to make the work more enjoyable

First, take a brief look at the code to see how it's implemented. I anticipate that the first instinct to style rows will be passing `bg-color` to `<Datagrid.Row>`. However, you should style `<Datagrid.Cell/>` instead. I couldn't achieve a good appearance for the datagrid otherwise.

For example:

```js
<Datagrid.Cell class={{cell: 'bg-red-400'}}>
```

As for predefined components, not all of them currently support styling via `class`. You'll need to edit them directly. I would be grateful for the github PR.

## Styling part II

The CLI script modifies `app.css` and `tailwind.config.ts`, adding CSS variables and extending Tailwind classes.

```ts
// app.css
--table-primary: 0 0% 98%;
--table-primary-hover: 0 0% 92%;
--table-secondary: 0 0% 96%;
--table-secondary-hover: 0 0% 92%;

--table-row-odd: 0 0% 99%;
--table-row-odd-hover: 0 0% 86%;
--table-row-even: 0 0% 95%;
--table-row-even-hover: 0 0% 89%;
```

```ts
table: {
  primary: {
    DEFAULT: "hsl(var(--table-primary) / <alpha-value>)",
    hover: "hsl(var(--table-primary-hover) / <alpha-value>)"
  },
  secondary: {
    DEFAULT: "hsl(var(--table-secondary) / <alpha-value>)",
    hover: "hsl(var(--table-secondary-hover) / <alpha-value>)"
  },
  row: {
    even: {
      DEFAULT: "hsl(var(--table-row-even) / <alpha-value>)",
      hover: "hsl(var(--table-row-even-hover) / <alpha-value>)"
    },
    odd: {
      DEFAULT: "hsl(var(--table-row-odd) / <alpha-value>)",
      hover: "hsl(var(--table-row-odd-hover) / <alpha-value>)"
    }
  }
}
```

> This is how it looks at the moment. I’m not satisfied with it and it will likely be changed soon. I plan to support various themes and popular design systems like MUI, etc. I'm considering implementing it using [open-props](https://open-props.style/) or moving away from Tailwind in favor of plain CSS. The headless version essentially allows you to style it as you like.

## Headless

<mark>NOT TESTED</mark>

If you want to implement a headless version, nothing is stopping you. Remove any predefined components you don’t intend to use and implement your own in their place. Keep in mind that some of them contain logic necessary for the datagrid to function. For example, to enable `fullscreen mode`, an element like this is required:

```svelte
<div bind:this={end} aria-hidden="true" class="hidden"></div>
```

Additionally, `<Datagrid.Datagrid/>` updates data when changes occur, and `<Datagrid.Cell>` applies the logic for pinning columns, etc.

> In the future (probably version 3), examples will be provided, and functionality will be tested.
