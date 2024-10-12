<script>
	import PageCodeContainer from '$lib/blocks/page-code-container.svelte';
	import PageContainer from '$lib/blocks/page-container.svelte';
	import PageTitle from '$lib/blocks/page-title.svelte';
	import { Highlight } from 'svelte-highlight';
	import { typescript } from 'svelte-highlight/languages';
	import { code } from './_components/code';
	import CH from '$lib/blocks/code-highlight.svelte';
	import Datagrid from './_components/datagrid.svelte';
</script>

<PageContainer>
	<PageTitle title="Column Aligment" />

	<p>
		On this page, you'll learn how to align columns and see how it's implemented so you can make
		your own enhancements.
	</p>
	<p>
		Property <CH>align</CH> specifies how a column data is aligned.
	</p>

	<PageCodeContainer>
		<Highlight language={typescript} code={code.baseColumns} />
	</PageCodeContainer>

	<Datagrid />

	<PageCodeContainer>
		<Highlight language={typescript} code={code.columns} />
	</PageCodeContainer>
	<div class="flex flex-col gap-2">
		<p>Aligment can be overridden within cell or header styles.</p>
		<p>It is possible to programatically change the alignment with little tweak in the code.</p>
	</div>
</PageContainer>
