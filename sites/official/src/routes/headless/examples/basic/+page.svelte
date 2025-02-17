<script lang="ts">
	import BasicDatagrid from '../_components/datagrids/basic/basic-datagrid.svelte';
	import rehypeSanitize from 'rehype-sanitize';
	import rehypeStringify from 'rehype-stringify';
	import remarkParse from 'remark-parse';
	import remarkRehype from 'remark-rehype';
	import { remark } from 'remark';
	import md from './documentation.md?raw';

	let { data } = $props();

	import { onMount } from 'svelte';
	import remarkToc from 'remark-toc';

	let results = $state('');
	onMount(async () => {
		results = await remark()
			.use(remarkToc, { heading: 'Table of Contents', tight: true, maxDepth: 5 })
			.use(remarkParse)
			.use(remarkRehype)
			.use(rehypeSanitize)
			.use(rehypeStringify)
			.process(md)
			.then((res) => String(res));
		console.log(results);
	});
</script>

<h2>Basic datagrid implementation</h2>

<BasicDatagrid {data} />
<div class="prose w-full min-w-full">
	{@html results}
</div>
