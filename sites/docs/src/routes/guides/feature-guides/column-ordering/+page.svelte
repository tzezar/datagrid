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
	<PageTitle title="Column Ordering" />

	<p>
		On this page, you'll learn how to enable column reodering and see how it's implemented so you
		can make your own enhancements.
	</p>
	<p>
		Property <CH>moveable</CH> specifies whether a column can be reordered.
	</p>

	<PageCodeContainer>
		<Highlight language={typescript} code={code.baseColumns} />
	</PageCodeContainer>

	<Datagrid />

	<PageCodeContainer>
		<Highlight language={typescript} code={code.columns} />
	</PageCodeContainer>

	<p><CH>grow</CH> and <CH>align</CH> was added for nicer data look</p>
</PageContainer>
