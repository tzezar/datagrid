<script lang="ts">
	import PageCodeContainer from '$lib/blocks/page-code-container.svelte';
	import PageContainer from '$lib/blocks/page-container.svelte';
	import PageTitle from '$lib/blocks/page-title.svelte';
	import { Highlight } from 'svelte-highlight';
	import { typescript } from 'svelte-highlight/languages';
	import { code } from './_components/code';
	import ImportantInformation from '$lib/blocks/important-information.svelte';
	import CH from '$lib/blocks/code-highlight.svelte';
	import Datagrid from './_components/datagrid.svelte';
	import * as Accordion from '$lib/components/ui/accordion';

</script>

<PageContainer>
	<PageTitle title="Custom Cells and Headers" />

	<div>
		<Datagrid />
		<Accordion.Root>
			<Accordion.Item value="item-1">
				<Accordion.Trigger>Code</Accordion.Trigger>
				<Accordion.Content>
					<PageCodeContainer>
						<Highlight language={typescript} code={code.grid} />
					</PageCodeContainer>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</div>
	
</PageContainer>
