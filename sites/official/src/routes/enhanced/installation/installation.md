---
title: Installation
---

<script>
</script>

# {title}

Welcome to the enhanced datagrid! This guide will walk you through the installation process, including setting up necessary components and configurations.

## Prerequisites

Ensure that you have the following set up before proceeding:
- A working [Svelte](https://svelte.dev/) project
- [Tailwind CSS](https://tailwindcss.com/) installed and configured
- [Shadcn-Svelte](https://next.shadcn-svelte.com/docs/installation) components


## Automatic installation

The easiest way to install is using our CLI tool.

### Using the CLI

```cmd
npx tzezars-datagrid@latest init
```

During installation, you'll be prompted to answer two configuration questions:

```cmd

1 Where do you want to install the component? ... ./src/lib/datagrid
2 Do you want to install dependencies? ... yes

```

### Installation Complete

> Note: If dependency installation fails (a known random issue), you can install packages manually. Please report any issues on our GitHub repository.

## Manual Installation Steps

### 1. Install Tzezar's Datagrid Core

To get started, you'll need to install the core dependencies. Follow the instructions in the [quick start guide](/headless/quick-start/installation/) to set up your project.

### 2. Add `datagrid-enhanced` Component

To integrate the enhanced datagrid component into your project, clone the repository from GitHub:

```bash
git clone https://github.com/tzezar/datagrid.git
```

Navigate to the datagrid-enhanced directory inside the repo:

```bash
cd packages/cli/datagrid-enhanced
```

## 3. Update Tailwind Configuration

Ensure that your Tailwind CSS configuration is properly set up to support the components used in the datagrid. Update your tailwind.config.ts file as follows:

#### Define Color Variables in `app.css`

Create custom color variables in your app.css file to ensure proper styling:

```json
@layer base {
	:root {
		--grid-overlay: 0 0% 100%;
		--grid-background: 0 0% 100%;
		--grid-foreground: 0 0% 3.9%;
		--grid-primary: 0 0% 100%;
		--grid-secondary: 0 0% 98.5%;
		--grid-accent: 200 50% 80%;
		--grid-border: 0 0% 70%;
		/* ...rest */
	}

	.dark {
		--grid-overlay: 0 0% 3.9%;
		--grid-background: 0 0% 4%;
		--grid-foreground: 0 0% 98%;
		--grid-primary: 0 0% 4%;
		--grid-secondary: 0 0% 10%;
		--grid-accent: 200 50% 50%;
		--grid-border: 0 0% 14.9%;
		/* ...rest */
	}
}
```

### Insert styles in `app.css` at `@layer base`

<div class='overflow-auto max-h-[400px]'>

```json
@layer components {
	.grid-body-overlay {
		@apply pointer-events-auto absolute bottom-0 left-0 right-0 top-0 z-[5] h-full w-full bg-grid-overlay opacity-50;
	}

	.grid-wrapper-overlay {
		@apply pointer-events-auto absolute bottom-0 left-0 right-0 top-0 z-[25] h-full w-full bg-grid-overlay opacity-50;
	}

	.grid-wrapper {
		/* Whole content inside */
		/* max-h is required for virtualized container */
		@apply relative flex max-h-[600px] flex-col bg-grid-background;

		&[data-fullscreen='true'] {
			@apply absolute inset-0 z-20 max-h-screen p-4;
		}
	}

	.grid-container-wrapper {
		/* If virtualized this is inner container */
		@apply inline-block w-full overflow-auto border border-grid-border;

		&[data-fullscreen='true'] {
			@apply overflow-auto;
		}
	}

	.grid-container {
		@apply inline-block h-full min-w-full grow-0;

		&.grid-container-shadcn {
			@apply bg-background;
		}
	}

	/* Header */
	.grid-head {
		@apply flex flex-row;

		&.grid-head-sticky {
			@apply sticky top-0 z-10;
		}

		&.grid-head-shadcn {
			@apply bg-grid-background;
		}
	}

	.grid-head-row {
		@apply flex w-full flex-row;
	}

	.grid-head-row-leaf-column-cell {
		@apply flex h-full flex-col justify-end self-end border-b border-r border-grid-border p-2 text-sm font-medium leading-4;

		width: var(--width);
		min-width: var(--min-width);
		max-width: var(--max-width);

		&[data-pinned] {
			@apply border-grid-border bg-grid-primary;
		}

		&[data-pinned='right'] {
			@apply border-l border-r-0;
			right: var(--pin-right-offset, 0);
		}

		&[data-pinned='left'] {
			@apply border-l-0 border-r;
			left: var(--pin-left-offset, 0);
		}
	}

	.grid-head-row-leaf-column-cell-content {
		@apply flex w-full flex-row flex-nowrap items-end justify-between;

		&.sortable {
			cursor: pointer;
			user-select: none;
		}
		&.sortable:hover {
		}

		.sort-indicator {
			display: flex;
			align-items: center;
			opacity: 0.5;
		}

		&.sortable:hover .sort-indicator {
			opacity: 1;
		}
	}

	.grid-head-row-group-column-cell-content {
		@apply flex flex-row items-center border-b border-r border-grid-border px-2 py-2;
	}

	.grid-head-row-group-column-cell {
		@apply flex h-full flex-col text-sm font-medium leading-4;
	}

	.grid-head-row-group-column-cell-header {
		@apply flex h-full flex-row items-center justify-center gap-2 text-center;
	}

	/* Body */
	.grid-body {
		@apply relative flex w-full flex-col;
	}

	.grid-body-row {
		@apply flex h-full flex-row border-b border-grid-border;

		&:last-child {
			border-bottom: none;
		}
	}

	.grid-body-row-expanded {
		@apply flex h-full flex-row border-b border-grid-border;

		&:last-child {
			border-bottom: none;
		}
	}

	.grid-body-row-cell {
		@apply relative flex shrink-0 items-center px-1 py-2 transition-all duration-300;
		width: var(--width);
		min-width: var(--min-width);
		max-width: var(--max-width);

		&[data-pinned] {
			@apply border-grid-border bg-grid-primary;
		}

		&[data-pinned='right'] {
			right: var(--pin-right-offset, 0);
			@apply border-l;
		}

		&[data-pinned='left'] {
			left: var(--pin-left-offset, 0);
			@apply border-r;
		}
	}

	.grid-body-row-cell-highlighted {
		/* Remove position: relative since it's now in the parent */
		z-index: 1;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: hsl(var(--grid-accent) / 0.2);
			pointer-events: none;
		}
	}

	/* Add specific styling for cells with copy button */
	.grid-body-row-cell:has(button) {
		.grid-body-row-cell-highlighted::before {
			/* Ensure highlight doesn't interfere with button visibility */
			z-index: -1;
		}
	}

	.grid-body-row-cell-content {
		@apply flex w-full overflow-hidden text-ellipsis whitespace-nowrap;
	}

	.grid-body-group-row {
		@apply flex w-full flex-row border-b border-grid-border;
	}

	/* Pinned columns base positioning */
	[data-pinned='right'],
	[data-pinned='left'] {
		position: sticky;
		z-index: 2;
		background-clip: padding-box;
	}

	/* Footer */

	.grid-footer-container {
		@apply sticky bottom-0 left-0 border-b border-grid-border p-2;
	}

	/* Toolbar */

	.grid-toolbar-container {
		@apply flex items-end justify-end border-l border-r border-t border-grid-border;
	}

	/* Column Filtering */

	.grid-head-row-leaf-column-filter-input-wrapper {
		@apply h-9 w-full pt-1;
	}

	.grid-head-row-leaf-column-filter-input {
		@apply h-6 w-full rounded-sm border border-grid-border px-0 py-1 text-xs;
		color: hsl(var(--muted-foreground));
	}

	/* Pagination */

	.grid-pagination-container {
		@apply flex min-w-full flex-row items-center justify-between gap-2 border-x border-grid-border p-3 md:flex-row;
	}

	.grid-pagination-container-page-input {
		@apply !h-5 w-full max-w-[60px] border-grid-border p-2 !text-xs;
	}

	.grid-custom-scrollbar {
		/* width */
		::-webkit-scrollbar {
			width: 10px;
			height: 10px;
		}

		/* Track */
		::-webkit-scrollbar-track {
			border-left: solid 1px hsl(var(--grid-border));
			border-top: solid 1px hsl(var(--grid-border));
			background: hsl(var(--grid-background));
		}

		/* Handle */
		::-webkit-scrollbar-thumb {
			background: hsl(var(--muted-foreground));
		}

		/* Handle on hover */
		::-webkit-scrollbar-thumb:hover {
			background: hsl(var(--muted-foreground) / 50);
		}
	}
}
```
</div>

### Required Dependencies

For global search functionality:

```cmd
npm i fuse.js
```

For data export features:

```cmd
npm i papaparse xlsx fast-xml-parser
```
1. `papaparse` - CSV export
2. `xlsx` - Excel export
3. `fast-xml-partser` - XML export

Virtual scrolling:

```cmd
npm i svelte-virtuallists
```


### Optional:

The fast-sort package provides better sorting algorithms compared to our default implementation which uses the Schwartzian Transform. Choose this if you need enhanced sorting performance.

```cmd
npm i fast-sort
```


