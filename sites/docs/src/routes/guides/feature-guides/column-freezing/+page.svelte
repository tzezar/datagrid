<script>
	import PageCodeContainer from '$lib/blocks/page-code-container.svelte';
	import PageContainer from '$lib/blocks/page-container.svelte';
	import PageTitle from '$lib/blocks/page-title.svelte';
	import { Highlight } from 'svelte-highlight';
	import { typescript } from 'svelte-highlight/languages';
	import { code } from './_components/code';
	import ImportantInformation from '$lib/blocks/important-information.svelte';
	import CH from '$lib/blocks/code-highlight.svelte';
	import Datagrid from './_components/datagrid.svelte';
</script>

<PageContainer>
	<PageTitle title="Column Freezing" />

	<p>
		On this page, you'll learn how to enable column pinning and see how it's implemented so you can
		make your own enhancements.
	</p>
	<p>
		When defining columns, there are two key properties to consider:
		<CH>pinnable</CH>
		and
		<CH>pinned</CH>
	</p>

	<PageCodeContainer>
		<Highlight language={typescript} code={code.baseColumns} />
	</PageCodeContainer>

	<p>
		<CH>pinnable</CH> – as the name suggests, this defines whether a column can
		be pinned by default.
	</p>
	<p>
		<CH>pinned</CH> – this is an object containing two keys: <CH>position</CH> and <CH>offset</CH>.
		The <CH>position</CH> specifies which side of the table the column is pinned to, while the <CH>offset</CH> is a
		value calculated internally by the functions <CH>getOffsetLeft()</CH> and <CH>getOffsetRight()</CH>, and applied through
		the <CH>applyOffset()</CH> function whenever the pinned state of the column changes.
	</p>

	<ImportantInformation>
		<CH>{`offset`}</CH> is calculated automatically. Do not set it manually as
		it will be overwritten.
	</ImportantInformation>

	<p>
		To pin a column by default, you need to specify its `position` during the column definition.
	</p>

	<PageCodeContainer>
		<Highlight language={typescript} code={code.simpleColumn} />
	</PageCodeContainer>
	<p>Example</p>
	<Datagrid />
	<PageCodeContainer>
		<Highlight language={typescript} code={code.columns} />
	</PageCodeContainer>
</PageContainer>
