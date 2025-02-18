---
title: Getting started
---

<script>
import BasicDatagrid from './basic-datagrid.svelte';
import BasicDatagridFixed from './basic-datagrid-fixed.svelte';
import { inventoryData as data } from '$lib/data/data-storage.svelte';
</script>

# {title}

Na tej stronie znajdziesz wprowadzenie, które umożliwi Ci zaczęcie w trybie ekspresowym pracy z Tzezar's Datagrid w wersji core (headless). Jeżeli potrzebujesz przykładów z dokładniejszą implementacją to zapraszam do examples lub do przejrzenia API.

## Nie ma datagridu bez danych

W tym przykładzie niech to będą nasze dane:

```ts
export const data = [
	{
		id: 1,
		name: 'Product',
		price: {
			retail: 20,
			currency: 'PLN'
		}
	}
];
```

Stworzymy sobie do nich typ, który potem użyjemy by ułatwić sobie pracę:

```ts
type InventoryItem = {
	id: number;
	name: string;
	price: {
		retail: string;
		currency: string;
	};
};
```

## Czas na kolumny

```ts
import {
	accessorColumn,
	columnGroup,
	computedColumn,
	displayColumn,
	type ColumnDef
} from '$lib/datagrid/index.js';

export const columns = [
	accessorColumn({
		accessorKey: 'id'
	}),
	columnGroup({
		header: 'Product',
		columns: [
			accessorColumn({
				accessorKey: 'name'
			}),
			computedColumn({
				header: 'Price',
				getValueFn: (row) => row.price.retail + row.price.currency
			})
		]
	}),
	displayColumn({
		columnId: 'expansion',
		header: '',
		cell: () => '<div>+</div>'
	})
] satisfies ColumnDef<InventoryItem>[];
```

Jak mogłeś zauważyć istnieją cztery creatory kolumn:

`accessorColumn` - pozwala wyświetlić komórki używając danych

`computedColumn` - pozwala wyświetlić komórki, które łączą kilka accessor columns

`displayColumn` - umożliwia wyświetlanie dodatkowych komórki, które nie opierają się na danych

`columnGroup` - pozwala zgrupować kolumny

> Aby uzyskać intelisense przy definiowaniu accessor/display columns należy dodać
>
> ```ts
> satisfies ColumnDef<InventoryItem>[]
> ```

Jak spojrzymy na definicję `ColumnDef`

```ts
export type ColumnDef<TOriginalRow, TMeta = any>
```

to zobaczymy, że przyjmuje ona drugi generyczny typ `TMeta`. Dodając go mamy ładnie otypowane wartości `_meta` kolumn.

na przykład:

```ts
type MyColumnMeta {
	youAreAwesome: boolean
}

export const columns = [
	accessorColumn({
		accessorKey: 'id',
		_meta: {
			youAreAwesome: true
		}
	}),
] satisfies ColumnDef<InventoryItem, MyColumnMeta>[];
```

na teraz w zasadzie to tyle o kolumnach, stwórzmy datagrid!

## Datagrid instance

Zaczniemy prosto:

```ts
import { DatagridCore } from '$lib/datagrid/index.js';

const datagrid = new DatagridCore({
	columns,
	data
});
```

Aby stworzyć datagrid potrzebujemy kolumn i danych, jest to minimum konfiguracji. Wspomnę na samych początki, że DatagridCore przyjmuje `initialState`, który pozwoli Ci zdefiniować stan początkowy datagridu.

```ts
const datagrid = new DatagridCore({
	columns,
	data,
	initialState: {
		// Configure initial state here
	}
});
```

Wierzę, że pokryje to 90% zastosowań.

Jeżeli jednak potrzebujesz skonfigurować / dostosować datagrid do swoich potrzeb, możesz to w łatwy sposób zrobić:

```ts
class MySortingFeature extends SortingFeature {
	isManual = false;
	someExtra: string = 'Hello';

	whoIsTheBoss() {
		return 'You are!`
	}

	// ovverride
	isColumnSorted(columnId: ColumnId, direction?: SortingDirection): boolean {
		console.log('How awesome!');
		return super.isColumnSorted(columnId, direction);
	}

	constructor(datagrid: DatagridCore) {
		super(datagrid);
	}
}

let datagrid = new Grid.EnhancedCore<InventoryItem, Grid.EnhancedMeta<InventoryItem>>({
	columns,
	data: data.inventory,
	features: {
		sorting: MySortingFeature
	},
	initialState: {
		grouping: {
			activeGroups: ['category']
		}
	}
});
```

datagrid jest naprawdę elastyczny, w powyższym przykładzie stworzyłem customowy SortingFeature, gdzie mogłem zdefiniować stan (zamiast w `initialState`), dodać swoje wartości, nadpisać metody `SortingFeature`, dodać swoje metody itp.

### Dodatkowe informacje o DatagridCore

Po przeczytaniu wprowadzenia moim zdaniem logicznym krokiem byłoby pobieżne przejrzenie > API do DatagridCore.

Jeżeli chcesz to zrobić później to chciałbym abyś teraz wiedział, ze tworzenie wrappera wokół `DatagridCore` jest całkiem proste i totalnie masz wolną rękę jak to zaimplementujesz. Mało rzeczy będzie Cię ograniczać. Po pierwsze masz dostęp do pełnego kodu, starałem się go napisać tak aby był przystępny nawet dla początkujych developerów. Wszystkie klasy, funkcje itp. są opisane. Dostępne są do Twojej dyspozycji `LifecycleHooks`, które pozwalają na relatywnie łatwe dostosowanie transformacji danych / kolumn z poziomu wrappera. np: `PRE_PROCESS_DATA`. Masz dostęp do wielu eventu, na które możesz nasłuchiwać np.

```ts
datagrid.events.on('onColumnSort', ({ column }) => {
	console.log('onColumnSort', column);
});
```

Zaimplementowany został `cacheManager`, istnieją dwa główne procesory:

```ts
processors = {
	data: new DataProcessor(this),
	column: new ColumnProcessor(this)
};
```

Zawierają logikę do transofmorwania kolumn i danych.
Dwa "menagery" `datagrid.columns` i `datagrid.rows` zawierające utils.
no i również są `datagrid.handlers`, które pełnią rolę controllera łączącego logikę róznych features i całego datagridu.

## Wyświetlanie datagridu

Wprowadznie te odnosi sie do Tzezar's Datagrid Core tj. headless wersji datagridu. Znaczy to mniej więcej tyle, że dostajesz helpery i zbudowaną wewnętrzną logikę na fundamentach których możesz wyrenderować wedle własnych potrzeb datagrid.

Możesz użyć `<table>`, możesz stworzyć wersję mobile datagridu, ja w tym przykładzie zbuduję podstawowy datagrid z `divs`.

### Dlaczego nie `<table>`?

Using `<div>`-based tables instead of `<table>` elements can offer several advantages, especially in modern web applications. Here’s why:

1. More Flexible Styling with CSS
   `<div>` tables provide greater control over layout using Flexbox or CSS Grid, allowing for more dynamic and responsive designs.
   Traditional `<table>` elements can be rigid and difficult to style, especially when it comes to complex layouts like pinned headers, sticky columns, or dynamic row heights.
2. Better Performance for Large Datasets
   `<table>` elements can become slow when handling large datasets because the browser enforces row-by-row rendering and recalculates layout constraints.
   `<div>` tables allow for virtual scrolling, where only visible rows are rendered, improving performance significantly.
3. Custom Scroll Behavior
   Native `<table>` elements tie scrolling behavior to the entire table structure, making features like independent body scrolling or sticky headers harder to implement.
   With a `<div>`-based table, you can fully control overflow, sticky positioning, and smooth scrolling.
4. Better Accessibility Control
   While `<table>` elements have built-in semantics for accessibility, they can sometimes be restrictive.
   `<div>` tables let you manually define ARIA roles and tailor accessibility for screen readers based on your specific needs.
5. More Control Over Column Resizing & Reordering
   In an `<html>` table, columns and rows are inherently tied together, making resizing and drag-and-drop reordering complex.
   With `<div>` tables, columns can be resized independently, and row structures can be rearranged dynamically.
6. Easier Integration with JavaScript Frameworks
   Many modern frameworks (like Svelte, React, or Vue) work better with component-based approaches.
   A `<div>`-based grid structure allows for more reusable components and better state management.
7. More Customizable Interaction Handling
   Features like cell selection, copy-paste support, keyboard navigation, and custom tooltips are easier to implement without being constrained by the browser's built-in `<table>` behavior.
   When to Use `<table`>`Instead?

If the data is purely tabular and needs to be read by screen readers without extra customization, an`html`table might be preferable.
For simpler, static datasets where the built-in browser features (like thead, tbody, and tr elements) provide sufficient structure.
For modern, highly interactive data tables,`<div>`-based approaches generally offer better performance, flexibility, and user experience. 🚀

### Pokażesz w końcu ten datagrid? 🤔

No pewnie! Stwórzmy więc strukturę datagridu. Użyłem klas nawaznych podobnie do struktury `<table>`, by pokazać podobieństwo (style dostępne w repozytorium na githubie).

```svelte
<div class="wrapper">
	<div class="table">
		<div class="thead">
			<div class="tr">
				{#each datagrid.columns.getLeafColumns() as column}
					<div class="th">
						{column.header}
					</div>
				{/each}
			</div>
		</div>
		<div class="tbody">
			{#each datagrid.rows.getVisibleBasicRows() as row}
				<div class="tr">
					{#each datagrid.columns.getLeafColumns() as column}
						<div class="td">
							{getCellContent(column, row.original)}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>
```

<BasicDatagrid {data} />

ale, chwila, chwila... co to za `<div>+</div>`?

> Jak już wspomiałem datagrid został zbudowany by być elastycznym (obiecuję, ostatni raz o tym wspominam).

```ts
export type CustomCell<TOriginalRow> = (
	props: CustomCellProps<TOriginalRow>
) => string | HTMLElement | CustomCellComponentWithProps;
```

Definiując więc komórki mamy do wyboru kilka opcji takich jak:

1. `string` - tj. tu wpisz cos
2. `HTMLElement` - ....
3. `CustomElement` - svelte komponent

Svelte 5 wprowadza zarąbiste snippets, więc użyjemy ich aby to zobrazować. Dla Twojej wygody w `datagrid/prebuilt` do dyspozycji masz gotowe komponenty jak `<RenderCell />`.

```svelte
<div class="tbody">
	{#each datagrid.rows.getVisibleBasicRows() as row}
		<div class="tr">
			{#each datagrid.columns.getLeafColumns() as column}
				<div class="td">
					{@render CellRenderer(column, row)}
				</div>
			{/each}
		</div>
	{/each}
</div>

{#snippet CellRenderer(column: LeafColumn<any>, row: GridBasicRow<any>)}
	{@const cellContent = column.cell ? column.cell({ datagrid, column, row }) : null}
	{#if cellContent}
		{#if typeof cellContent === 'string'}
			{@html cellContent}
		{:else if isCellComponent(cellContent)}
			<cellContent.component {datagrid} {row} {column} />
		{/if}
	{:else}
		<span>
			{@html getCellContent(column, row.original)}
		</span>
	{/if}
{/snippet}
```

albo

```svelte
<div class="tbody">
	{#each datagrid.rows.getVisibleBasicRows() as row}
		<div class="tr">
			{#each datagrid.columns.getLeafColumns() as column}
				<RenderCell {datagrid} {row} {column} />
			{/each}
		</div>
	{/each}
</div>
```

<BasicDatagridFixed {data} />


## Brawo! Dotarłeś do końca!

Przejdź teraz do przykładów lub do API reference. Jeżeli szukasz gotowego komponentu z warstwą abstrakcji - to zapraszam do sekcji enhanced datagrid.