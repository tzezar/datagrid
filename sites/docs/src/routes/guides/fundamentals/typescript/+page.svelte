<script>
	import PageCodeContainer from '$lib/blocks/page-code-container.svelte';
	import PageContainer from '$lib/blocks/page-container.svelte';
	import PageTitle from '$lib/blocks/page-title.svelte';
	import { Highlight } from 'svelte-highlight';
	import { typescript } from 'svelte-highlight/languages';
	import { code } from './_components/code';
	import ImportantInformation from '$lib/blocks/important-information.svelte';
	import CodeHighlight from '$lib/blocks/code-highlight.svelte';
</script>

<PageContainer>
	<PageTitle title="Typescript" />
	<p>
		Tzezar's data grid fully supports TypeScript and utilizes generics to maintain column and row
		types, making your work more efficient and less prone to errors.
	</p>
	<p>
		The first step in simplifying the process is to define your column types. This ensures type
		safety during column declaration and while rendering the data grid.
	</p>
	<PageCodeContainer>
		<Highlight language={typescript} code={code.columns} />
		<p class="opacity-50">nested id's does not provide type safety in version 1.0.0</p>
	</PageCodeContainer>
	<ImportantInformation>
		Make sure to pass your row type using: <CodeHighlight
			>{`satisfies BaseColumn<"YOUR_DATA_TYPE">[]`}</CodeHighlight
		>.
	</ImportantInformation>
	<p>
		The <CodeHighlight>BaseColumn</CodeHighlight> is a generic type that defines all the column options
		available to you.
	</p>
	<PageCodeContainer>
		<Highlight language={typescript} code={code.baseColumns} />
	</PageCodeContainer>
	<p>
		That's it! With proper typing, you'll have IntelliSense, even for custom columns. Row types are
		automatically inferred from the shape of the data you provide to the `data` property creating
		datagrid instance. This will be especially useful when defining custom components or rendering
		and styling custom cells.
	</p>
</PageContainer>
