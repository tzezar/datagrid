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
	<PageTitle title="Row Selection" />

	<p>
		In this section, you'll learn how to enable row selection and understand the internal implementation, 
		so you can make custom adjustments as needed.
	</p>

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
	<p>
		To provide more flexibility, I decided against a simple "allow row selection" option. Instead, 
		you can fully customize the row selection behavior with just a few extra lines of code. To make 
		this easier for you, I have prepared some ready-made components.
	</p>

	<p>
		I recommend starting by reading about how to define custom cells and headers.
	</p>

	<p>
		First, let's walk through implementing row selection, and then we’ll dive into how it works under the hood.
	</p>

	<div class="flex flex-col gap-4">
		<p>
			We’ll begin by creating a custom column with reasonable options that you will likely use in your use case.
		</p>
		<PageCodeContainer>
			<Highlight language={typescript} code={code.baseColumns} />
		</PageCodeContainer>
	</div>

	<div class="flex flex-col gap-4">
		<p>
			Next, we’ll render the header. This is straightforward using Svelte's templating syntax. 
			Here, I’m using a pre-built component.
		</p>
		<PageCodeContainer>
			<Highlight language={typescript} code={code.customHeader} />
		</PageCodeContainer>
	</div>

	<div class="flex flex-col gap-4">
		<p>
			We also need to display a checkbox for selecting rows.
		</p>
		<PageCodeContainer>
			<Highlight language={typescript} code={code.customCell} />
		</PageCodeContainer>

		<ImportantInformation>
			Note the usage of <CH>Datagrid.CellWithoutSpacing</CH>, a cell without padding, as the name suggests. 
			It differs from the standard cell by its logic and conditional styling.
		</ImportantInformation>
	</div>

	<p>
		You may have noticed that the selected rows are defined in two places. 
		The first variable, <CH>state.selectedRows</CH>, stores detailed information about the selected rows, 
		while <CH>internal.selectedRowIds</CH> is an optimization. 
		It uses a SvelteSet internally to store row IDs, ensuring excellent performance even with large datasets.
	</p>
	<p>Here will be section how to customize and build a custom row selection components.</p>
</PageContainer>
