<script lang="ts">
	import Datagrid from './_components/datagrid.svelte';
	import PageTitle from '$lib/blocks/page-title.svelte';
	import PageContainer from '$lib/blocks/page-container.svelte';
	import type { PageData } from './$types';
	import PageCodeContainer from '$lib/blocks/page-code-container.svelte';
	import { Highlight } from 'svelte-highlight';
	import { typescript } from 'svelte-highlight/languages';
	import { code } from './_components/code';

	export let data: PageData;
</script>

<PageContainer>
	<PageTitle title="Svelte query" />
	<Datagrid initialData={data} />
	<PageCodeContainer>
		<Highlight language={typescript} code={code.pagejs} />
		<Highlight language={typescript} code={code.datagrid} />
	</PageCodeContainer>
</PageContainer>
