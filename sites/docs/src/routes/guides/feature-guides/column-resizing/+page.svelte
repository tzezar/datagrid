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
	<PageTitle title="Column Resizing" />

	<p>
		On this page, you'll learn how to enable column rezising and see how it's implemented so you
		can make your own enhancements.
	</p>
	<p>
		Property <CH>resizable</CH> specifies whether a column can be resized.
	</p>
	<PageCodeContainer>
		<Highlight language={typescript} code={code.baseColumns} />
	</PageCodeContainer>
	
	<ImportantInformation>
		Combination of width, grow and resizable can result in interesting behaviour.
	</ImportantInformation>
	<p>The most common use case and what you probably want to do is to set <CH>grow</CH> to <CH>true</CH> on last column.</p>
	<Datagrid />

	<PageCodeContainer>
		<Highlight language={typescript} code={code.columns} />
	</PageCodeContainer>

</PageContainer>
