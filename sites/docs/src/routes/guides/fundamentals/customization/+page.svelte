<script>
	import PageCodeContainer from '$lib/blocks/page-code-container.svelte';
	import PageContainer from '$lib/blocks/page-container.svelte';
	import PageTitle from '$lib/blocks/page-title.svelte';
	import { Highlight } from 'svelte-highlight';
	import { typescript } from 'svelte-highlight/languages';
	import ImportantInformation from '$lib/blocks/important-information.svelte';
	import CodeHighlight from '$lib/blocks/code-highlight.svelte';
	import { hrefs } from '$lib/hrefs';
</script>

<PageContainer>
	<PageTitle title="Customization" />
	<p>Datagrid was created to be as flexible and powerful as possible.</p>

	<div class="flex flex-col gap-2">
		<h2>Styling</h2>
		<p>Every predefined component can be styled via class.</p>
		<p>For example passing</p>
		<Highlight language={typescript} code={`<Datagrid.Cell class='bg-red-500' />`} />
		<p>to a cell component will set the background color to red.</p>
		<Highlight
			language={typescript}
			code={`<Datagrid.Datagrid class={{table: "bg-blue-500"}} />`}
		/>
		<p>to a datagrid component will set the background color to blue.</p>
		<ImportantInformation>
			<p>
				As you can see in the example above class can take a string or an object for more
				complicated components. Dont worry, you get intelliSense.
			</p>
		</ImportantInformation>
	</div>
	<div class="flex flex-col gap-2">
		<h2>Building Custom Components</h2>
		<p>Every part of the data grid is customizable to fit your specific needs.</p>
		<p>
			The best approach, in my opinion, is to extend an existing pre-made component and adapt it to
			your requirements. However, if you need unique functionality, building a custom component from
			scratch is also a valid option.
		</p>
	</div>

	<div class="flex flex-col gap-2">
		<h2>Default Datagrid Slots</h2>
		<p>By default the datagrid has the following slots:</p>
		<ul class="list-inside list-disc">
			<li>head</li>
			<li>body</li>
			<li>pagination</li>
			<li>topBar</li>
			<li>loadingIndicator</li>
			<li>dataIndicator</li>
		</ul>
		<p>
			This provides default placement of all the components, but again as said before: feel free to
			extend and adapt them to your needs.
		</p>
		<ImportantInformation>
			<p>
				In some cases you dont event need to alter the default slots to create custom layout. Check <a
					href={hrefs.examples.advanced}
				>
					<CodeHighlight><span class='underline'>Example Advanced</span></CodeHighlight>
				</a> for more details and example of how to render custom pagination without altering datagrid default slots.
			</p>
		</ImportantInformation>
	</div>
</PageContainer>

<style>
	h2 {
		@apply text-xl font-semibold;
	}
</style>
