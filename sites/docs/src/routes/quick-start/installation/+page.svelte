<script>
	import CodeTerminal from '$lib/blocks/code-terminal.svelte';
	import PageContainer from '$lib/blocks/page-container.svelte';
	import PageNotDone from '$lib/blocks/page-not-done.svelte';
	import PageTitle from '$lib/blocks/page-title.svelte';
	import { Highlight } from 'svelte-highlight';
	import { typescript } from 'svelte-highlight/languages';
</script>

<PageContainer class="mx-auto max-w-screen-sm flex">
	<PageTitle title="Installation" />

	<p>
		As of today, datagrid uses components offered by shadcn-svelte. In the future there will be a
		native and headless version. So, I assume you have shadcn-svelte installed. If not
		<a class="text-orange-400 underline" href="https://www.shadcn-svelte.com/docs/installation">
			here
		</a> is how to do it. You do not need to install all components, only dropdown menu, select, button
		and optionally context menu, popover are used.
	</p>

	<div class='py-10'>
		<h2 class="text-lg font-semibold">Automatic installation</h2>
		<div class="flex flex-col">
			<p>To easily install datagrid:</p>
			<p>Run the CLI</p>
			<CodeTerminal command="coming soon" />
			<p>You will be asked a few questions to configure installation</p>
			<CodeTerminal
				withCopyButton={false}
				command="1 Where do you want to install the component? ... ./src/lib/components/datagrid
2 Where is your global CSS file? ... ./src/app.css
3 Where is your tailwind.config.[cjs|js|ts] located? ... ./tailwind.config.ts
4 Do you want to install dependencies? ... yes"
			/>
			<p>Thats it!</p>
		</div>
	</div>
	<div>
		<h2 class="text-lg font-semibold">Manual installation</h2>
		<div class="flex flex-col gap-8">
			<div class="flex flex-col">
				<!-- TODO update link -->
				<p>
					Copy code of datagrid from a <a
						class="text-orange-400 underline"
						href="https://github.com/tzezar/datagrid">github repository</a
					> into your project /todo: update link/
				</p>
			</div>
			<div class="flex flex-col">
				<p>Update tailwind.config.ts</p>
				<CodeTerminal
					withCopyButton={false}
					command={`colors: {
	table: {
		primary: {
			DEFAULT: "hsl(var(--table-primary) / <alpha-value>)",
			hover: "hsl(var(--table-primary-hover) / <alpha-value>)"
		},
		secondary: {
			DEFAULT: "hsl(var(--table-secondary) / <alpha-value>)",
			hover: "hsl(var(--table-secondary-hover) / <alpha-value>)"
		},
		row: {
			even: {
				DEFAULT: "hsl(var(--table-row-even) / <alpha-value>)",
				hover: "hsl(var(--table-row-even-hover) / <alpha-value>)"
			},
			odd: {
				DEFAULT: "hsl(var(--table-row-odd) / <alpha-value>)",
				hover: "hsl(var(--table-row-odd-hover) / <alpha-value>)"
			}
		}
	},
// ...rest
}`}
				/>
				<p>Update app.css</p>
				<CodeTerminal
					withCopyButton={false}
					command={`@layer base {
	:root {
		--table-primary: 0 0% 98%;
		--table-primary-hover: 0 0% 92%;
		--table-secondary: 0 0% 96%;
		--table-secondary-hover: 0 0% 92%;

		--table-row-odd: 0 0% 99%;
		--table-row-odd-hover: 0 0% 86%;
		--table-row-even: 0 0% 95%;
		--table-row-even-hover: 0 0% 89%;
		/* ...rest */
	}

	.dark {
		--table-primary: 0 0% 9%;
		--table-primary-hover: 0 0% 5%;
		--table-secondary: 0 0% 10%;
		--table-secondary-hover: 0 0% 5%;

		--table-row-odd: 0 0% 9%;
		--table-row-odd-hover: 0 0% 5%;
		--table-row-even: 0 0% 10%;
		--table-row-even-hover: 0 0% 5%;
		/* ...rest */
	}
}`}
				/>
				<div class="flex flex-col">
					<p>
						fast-sort (850bytes) is used for sorting, it provides sorting algorithms that are used
						to provide the best user experience with faster sorting
					</p>
					<CodeTerminal command="npm i fast-sort" />
				</div>
				<div class="flex flex-col">
					<p>
						Exporting data uses the following libraries, this is an optional feature, you can also
						install your replacements
					</p>
					<CodeTerminal command="npm i papaparse" />
					<CodeTerminal command="npm i xlsx" />
					<CodeTerminal command="npm i fast-xml-parser" />
				</div>
			</div>
		</div>
	</div>
</PageContainer>
