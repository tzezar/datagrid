<script>
	import CodeTerminal from '$lib/blocks/code-terminal.svelte';
	import PageContainer from '$lib/blocks/page-container.svelte';
	import PageNotDone from '$lib/blocks/page-not-done.svelte';
	import PageTitle from '$lib/blocks/page-title.svelte';
	import { Highlight } from 'svelte-highlight';
	import { typescript } from 'svelte-highlight/languages';
	import { code } from './_components/code';
	import CodeHighlight from '$lib/blocks/code-highlight.svelte';
	import ImportantInformation from '$lib/blocks/important-information.svelte';
	import Datagrid from './_components/datagrid.svelte';
</script>

<PageContainer class="mx-auto max-w-screen-sm gap-10">
	<PageTitle title="Getting started" />

	<p class="-mt-8">On this page you will learn how to create a datagrid.</p>

	<div>
		<h2 class="text-lg font-semibold">Data</h2>
		<div class="flex flex-col gap-4">
			<p>
				There is no datagrid without data! In order not to complicate this example, we will use
				predefined data, which will look as follows:
			</p>
			<Highlight language={typescript} code={code.data} />
			<p>
				There are no special requirements how your data looks like, as you can see the data can be
				nested, it does not have to be a flat structure.
			</p>
		</div>
	</div>
	<div>
		<h2 class="text-lg font-semibold">Defining columns</h2>
		<div class="flex flex-col gap-4">
			<p>Second step in creating a datagrid will be to define columns.</p>
			<Highlight language={typescript} code={code.columns} />
			<p>
				<CodeHighlight>BaseColumn</CodeHighlight> is a generic type. Give it the your data shape to get
				typesafety in column definition.
				<span class="opacity-60">(nested data at this point gives no intelisense)</span>
			</p>
			<ImportantInformation>
				Columns <CodeHighlight>id</CodeHighlight> and <CodeHighlight>title</CodeHighlight> are required
			</ImportantInformation>
			<p>
				Datagrid columns does not always behave like table columns, they have specified width. You
				can set your own width in columns definition with <CodeHighlight>width</CodeHighlight>. Eg.
				<CodeHighlight>width:"300px"</CodeHighlight>. In some scenarios I believe that adding
				<CodeHighlight>grow</CodeHighlight> to particular column is a better idea. Either first or last
				column is good candidate, or you can make any other most important column grow to fill the available
				space.
			</p>
			<ImportantInformation>
				You can specify <CodeHighlight>width</CodeHighlight> and <CodeHighlight>grow</CodeHighlight>
				to multiple columns
			</ImportantInformation>
			<p>
				A good practice is to place the columns in a separate file. This makes our main component
				look neater.
			</p>
		</div>
	</div>

	<div>
		<h2 class="text-lg font-semibold">Datagrid instance</h2>
		<div class="flex flex-col gap-4">
			<p>
				Svelte 5 allows you to define stores outside of .svelte files as a class. Datagrid takes
				advantage of this capability.
			</p>
			<p>Import the class and create an instance of it inside the context.</p>
			<Highlight language={typescript} code={code.instance} />
			<p>
				New instance of datagrid requires a <CodeHighlight>columns</CodeHighlight> and
				<CodeHighlight>data</CodeHighlight>.
			</p>
			<p>
				As you will see typesafety is preserved during the creation of datagrid later in the code.
			</p>
			<ImportantInformation
				>context has to be named <CodeHighlight>"datagrid"</CodeHighlight></ImportantInformation
			>
		</div>
	</div>
	<div>
		<h2 class="text-lg font-semibold">Rendering our datagrid</h2>
		<div class="flex flex-col gap-4">
			<div class="flex flex-col">Now it's time to render our datagrid. Relax, it's easy.</div>
			<Highlight language={typescript} code={code.rendering} />
			<div class="flex flex-col gap-4">
				<p>
					I'll explain what's going on here in a moment. I encourage you later to read the rest of
					the documentation to more in-depth understand the operation and why it looks this way.
				</p>
				<div class="flex flex-col gap-8">
					<Highlight language={typescript} code={`<Datagrid.Datagrid>`} />
					<p>
						This wrapper contains the basic datagrid logic and styling to give the datagrid the
						proper structure. It has two main slots:
						<CodeHighlight>head</CodeHighlight> and <CodeHighlight>body</CodeHighlight>.
						Suprisingly, they are optional — let me explain. In the future, the datagrid will
						support a headless mode, allowing for any arrangement of elements within the datagrid.
						However, using the provided snippets is recommended (at least for now).
					</p>
					<p>
						The <CodeHighlight>head</CodeHighlight> slot is used to render header elements, while the
						<CodeHighlight>body</CodeHighlight> slot is used to render data elements. Inside <CodeHighlight
							>head</CodeHighlight
						>, we have the ability to display header cells, render custom elements, and show column
						filters. So, for each header, we render a
					</p>
					<Highlight language={typescript} code={`<Datagrid.Header>`} />
					<p>
						which contains styling and logic for things like sorting. <CodeHighlight>column</CodeHighlight> is typed, which will make things easier in later examples.
						Inside the <CodeHighlight>body</CodeHighlight> slot, we display data cells. For each row,
						we display an element.
					</p>
					<Highlight language={typescript} code={`<Datagrid.Row>`} />

					<p>
						Notice that we used <CodeHighlight>datagrid.data</CodeHighlight> and not our own data we provided, because
						the data logic is applied within the datagrid. At this point, I want you to know that the
						datagrid provides, among other things:
					</p>

					<CodeHighlight>datagrid.internal.sortedData</CodeHighlight>
					<CodeHighlight>datagrid.internal.filteredData</CodeHighlight>
					<CodeHighlight>datagrid.internal.paginatedData</CodeHighlight>
					<p>
						The first two probably won't be useful to you, but <CodeHighlight
							>datagrid.paginatedData</CodeHighlight
						> is used to display rows split into pages, with sorting and filtering logic applied.
					</p>
					<p>
						Again, <CodeHighlight>{`<Datagrid.Row>`}</CodeHighlight> includes both styling and logic. Inside each row, we need to display the
						corresponding data cells. Therefore, we iterate over <CodeHighlight
							>datagrid.columns</CodeHighlight
						>. It is important to use the columns returned by the datagrid and not the ones we
						defined earlier. Then, we render a cell by passing a few props.
					</p>
					<Highlight language={typescript} code={`<Datagrid.Cell>`} />
					<p>
						The cell is wrapped with logic, and even custom elements should later be displayed
						inside it (or another sibling cell element - more later) using <CodeHighlight
							>custom</CodeHighlight
						> slot.
					</p>
					<p>
						Both row and column are typed, which significantly improves the developer experience
						(DX) and makes applying custom styles easier. Check the feature guides to learn more
						about rendering custom cells or how to apply logic and styles to selected cells or rows.
					</p>
				</div>
			</div>
		</div>
	</div>
	<div>
		<h2 class="text-lg font-semibold">Congratulations!</h2>
		<div class="flex flex-col gap-4">
			<p>
				You've just built your first datagrid—what an achievement! Creating a powerful and flexible
				grid like this is a huge step forward, and you’ve done a fantastic job bringing it to life.
			</p>
			<p>
				But this is just the beginning! There’s so much more you can do to enhance your datagrid.
				The feature guides are packed with tips on how to customize cells, apply unique styles, and
				introduce advanced logic to your rows and columns. The possibilities for fine-tuning and
				optimizing your grid are endless.
			</p>
			<p>
				So keep going! Experiment with new ideas, explore the documentation, and continue to build
				upon what you’ve already accomplished. You’re on a great path, and I’m excited to see what
				you’ll create next!
			</p>

			<Datagrid />
			<Highlight language={typescript} code={code.fullCode} />
		</div>
	</div>
</PageContainer>
