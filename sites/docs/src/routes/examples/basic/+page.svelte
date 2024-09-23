<script lang="ts">
	import { typescript } from 'svelte-highlight/languages';
	import Datagrid from './_components/datagrid.svelte';
	import { code } from './_components/code';
	import { Highlight } from 'svelte-highlight';
	import PageTitle from '$lib/blocks/page-title.svelte';
	import PageContainer from '$lib/blocks/page-container.svelte';
	import FeaturesImplemented from '$lib/blocks/features-implemented.svelte';
	import PageCodeContainer from '$lib/blocks/page-code-container.svelte';
</script>

<PageContainer>
	<PageTitle title="Basic example" />
	<Datagrid />
	<PageCodeContainer>
		<FeaturesImplemented features={['Sorting', 'Pagination', 'Datagrid title', 'Striped rows']} />
		<Highlight language={typescript} code={code.columns} />
		<Highlight language={typescript} code={code.datagrid} />
	</PageCodeContainer>
</PageContainer>
