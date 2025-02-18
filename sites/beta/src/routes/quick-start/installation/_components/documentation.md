---
title: Installation
date: '2024-10-17'
published: true
---

<script>
	import CodeTerminal from '$lib/blocks/code-terminal.svelte';
</script>

As of today, datagrid uses components offered by shadcn-svelte. In the future there will be a native and headless version. So, I assume you have shadcn-svelte installed. If not [here](https://www.shadcn-svelte.com/docs/installation) is how to do it. You do not need to install allcomponents, only dropdown menu, select, button and optionally context menu, popover are used.

## Automatic installation

### Run the CLI

<CodeTerminal command="npx tzezars-datagrid@latest init" />

You will be asked a few questions to configure installation

<CodeTerminal
	withCopyButton={false}
	command="1 Where do you want to install the component? ... ./src/lib/datagrid
2 Where is your global CSS file? ... ./src/app.css
3 Where is your tailwind.config.[cjs|js|ts] located? ... ./tailwind.config.ts
4 Do you want to install dependencies? ... yes"
/>

### Thats it!

> If you experience an error during installation of dependencies, please let me know by opening an issue in github. It happens randomly. As a workaround, install the package manually.

## Manual installation

### Get component 

Copy code of datagrid from a [github repository](https://github.com/tzezar/datagrid/tree/main/packages/cli/datagrid)

### Update `tailwind.config.ts`

```
colors: {
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
}
```

###  Update `app.css`

````
@layer base {
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
}```
````

### Install deps

fast-sort (850bytes) is used for sorting, it provides sorting algorithms that are used to provide the best user experience with faster sorting

<CodeTerminal command="npm i fast-sort" />

Exporting data uses the following libraries, this is an optional feature, you can also
install your replacements

<div class="flex flex-col gap-4">
	<CodeTerminal command="npm i papaparse" />
	<CodeTerminal command="npm i xlsx" />
	<CodeTerminal command="npm i fast-xml-parser" />
</div>
