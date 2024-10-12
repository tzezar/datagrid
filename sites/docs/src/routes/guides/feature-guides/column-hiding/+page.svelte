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
	<PageTitle title="Column Hiding" />

	<p>
		On this page, you'll learn how to enable column hiding and see how it's implemented so you can
		make your own enhancements.
	</p>
	<p>
		Two properties control the visibility of columns: 
		<CH>visible</CH> 
		and 
		<CH>hideable</CH>.
	</p>

	<PageCodeContainer>
		<Highlight language={typescript} code={code.baseColumns} />
	</PageCodeContainer>

	<p>
		<CH>hideable</CH> – specifies whether a column can be hidden.
	</p>
	<p>
		<CH>visible</CH> – represents the current visibility state of the column.
	</p>

	<Datagrid />

	<PageCodeContainer>
		<Highlight language={typescript} code={code.columns} />
	</PageCodeContainer>
	
	<p><CH>grow</CH> was added for nicer data look</p>
</PageContainer>
