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
	import type { PageData } from './$types';
	import DatagridPaginationClientSide from './_components/datagrid-pagination-client-side.svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	export let data: PageData;
</script>

<PageContainer>
	<PageTitle title="Pagination" />

	<p>
		On this page, you'll learn how to enable both client-side and server-side pagination and see how it's
		implemented so you can make your own improvements.
	</p>
	<div class="flex flex-col gap-2">
		<p>Let's start with how pagination is implemented.</p>
		<p>
			The pagination state is stored within <CH>datagrid.state.pagination</CH> and looks like this:
		</p>
	</div>
	<PageCodeContainer>
		<Highlight language={typescript} code={code.pagination} />
	</PageCodeContainer>
	<p>To display pagination, we need to specify that we want it to be shown.</p>
	<PageCodeContainer>
		<Highlight language={typescript} code={code.showPagination} />
	</PageCodeContainer>

	<div class="flex flex-col gap-2">
		<h2 class="text-xl">Client-Side Pagination</h2>
		<p>
			The <CH>count</CH> value should not be modified manually; it is calculated internally when the datagrid is initialized and updated whenever properties like <CH>page</CH>, <CH>perPage</CH>, or others such as <CH>filter</CH> and <CH>sorting</CH> change.
		</p>
		<p>
			You can modify the default values, such as <CH>page</CH> and <CH>perPage</CH>, to fit your needs.
		</p>
	</div>
	<div>
		<DatagridPaginationClientSide />
		<Accordion.Root>
			<Accordion.Item value="item-1">
				<Accordion.Trigger>Code</Accordion.Trigger>
				<Accordion.Content>
					<PageCodeContainer>
						<Highlight language={typescript} code={code.clientSide} />
					</PageCodeContainer>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</div>

	<div class="flex flex-col gap-2">
		<h2 class="text-xl">Server-Side Pagination</h2>
		<p>
			When using server-side rendering (SSR) and remote data, the datagrid needs to reflect the correct state on the first render. You can pass the pagination data received from the server. <CH>initialData</CH> can be fetched from the <CH>load</CH> function or via client-side fetches, depending on your data-fetching approach. The choice and implementation are up to you.
		</p>
	</div>

	<Datagrid initialData={data} />
	<div class="flex flex-col gap-2">
		<p>You can find the necessary data for pagination logic inside:</p>
		<PageCodeContainer>
			<Highlight language={typescript} code={code.variables} />
		</PageCodeContainer>
	</div>
	<div>
		<p>
			Below is an example using TanStack Query with SSR, as it's not a straightforward setup at the moment.
		</p>
		<Accordion.Root>
			<Accordion.Item value="item-1">
				<Accordion.Trigger>Code</Accordion.Trigger>
				<Accordion.Content>
					<PageCodeContainer>
						<Highlight language={typescript} code={code.load} />
					</PageCodeContainer>
					<div class="py-4"></div>
					<PageCodeContainer>
						<Highlight language={typescript} code={code.paginationExample} />
					</PageCodeContainer>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</div>
</PageContainer>
