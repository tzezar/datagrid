<script lang="ts">
	import PageContainer from '$lib/blocks/page-container.svelte';
	import PageTitle from '$lib/blocks/page-title.svelte';
	import Feature from './_components/feature.svelte';

	let features = [
		{
			title: 'Column freezing',
			description: 'Pinnable columns both left and right, works even for columns in the middle'
		},
		{
			title: 'Column reordering',
			description: 'Change column order with mobile friendly dropdown menu'
		},
		{
			title: 'Column resizing',
			description: 'Change column width with a slider - also better UX for mobile'
		},
		{
			title: 'Column hiding',
			description: 'Hide columns with a dropdown menu'
		},
		{
			title: 'Row expanding',
			description: 'Expand rows with a dropdown menu'
		},
		{
			title: 'Row expanding - sticky header',
			description: 'Row is visible when scrolling down the expanded row content'
		},
		{
			title: 'Row selection',
			description: 'Select rows, ready for bulk actions'
		},
		{
			title: 'Striped rows',
			description: 'Rows are striped with alternating colors'
		},
		{
			title: 'Multi column sorting',
			description: 'Sort multiple columns at once, superior performance due to optimization'
		},
		{
			title: 'Multi column filtering',
			description: 'Filter multiple columns at once'
		},
		{
			title: 'Pagination',
			description: 'Paginate your data'
		},
		{
			title: 'Data exporting',
			description: 'Export data to EXCEL, CSV, XML'
		},
		{
			title: 'Data copying',
			description: 'Copy data to clipboard'
		},
		{
			title: 'Adjusting spacing',
			description: 'Adjust spacing between columns and rows'
		},
		{
			title: 'Adjusting text size',
			description: 'Adjust text size with a dropdown menu'
		},
		{
			title: 'Fullscreen mode',
			description: 'Toggle fullscreen mode'
		},
		{
			title: 'Status indicator',
			description: 'Display status indicator for remote data status'
		},
		{
			title: 'Data indicator',
			description: 'Display data indicator'
		},
		{
			title: 'Scroll to top',
			description: 'Scroll to top button'
		},
		{
			title: 'Sticky header',
			description: 'Header always visible on scroll'
		},
		{
			title: 'Footer',
			description: 'Display information in custom footer'
		},
		{
			title: 'Header filter toggle',
			description: 'Toggle header filter visibility'
		},
		{
			title: 'Customization',
			description: 'Almost any customization is possible'
		},
		{
			title: 'Context menu',
			description: 'Right click on any element to open context menu'
		}
	];
</script>

<PageContainer class='max-w-screen-2xl mx-auto'>
	<PageTitle title="Features" />
	<div class=" flex flex-col flex-wrap gap-4">
		{#each features as feature}
			<Feature title={feature.title} description={feature.description} />
		{/each}
		<div class=" flex flex-col text-muted-foreground">
			<div class="flex-grow">
				<h2 class=" title-font text-lg font-medium leading-relaxed">Headless</h2>
				<p class="text-base leading-relaxed">Planned: build your own datagrid</p>
			</div>
		</div>
		<div class=" flex flex-col text-muted-foreground">
			<div class="flex-grow">
				<h2 class=" title-font text-lg font-medium leading-relaxed">Virtualization</h2>
				<p class="text-base leading-relaxed">Planned: display all data at once on one page</p>
				<p class="text-base leading-relaxed">Will be implemented as soon as some virtualization library comes out to support svelte 5. Probably @tanstack-virtual.</p>
			</div>
		</div>
		<div class=" flex flex-col text-muted-foreground">
			<div class="flex-grow">
				<h2 class=" title-font text-lg font-medium leading-relaxed">Keyboard navigation</h2>
				<p class="text-base leading-relaxed">
					Partially implemented: navigate with arrow keys 
				</p>
			</div>
		</div>

		<div class=" flex flex-col text-muted-foreground">
			<div class="flex-grow">
				<h2 class=" title-font text-lg font-medium leading-relaxed">Cell selection (excel like)</h2>
				<p class="text-base leading-relaxed">
					Partially implemented: select cells in excel like way
				</p>
			</div>
		</div>
	</div>
</PageContainer>
