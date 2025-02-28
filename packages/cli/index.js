#!/usr/bin/env node

const layerAdditions = `
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

		/* ! does not work for some reason */
		/* &:not([data-pinned]):last-of-type {
			@apply !bg-red-400;
		} */

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
		/* text-overflow: ellipsis;
		text-wrap: nowrap;
		overflow: hidden; */
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
			/* Changed from ::after to ::before */
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
}`


import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import { execa } from 'execa';
import { program } from 'commander';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const installCoreDependencies = async () => {
  const dependencies = ['fast-sort', 'papaparse', '@types/papaparse', 'xlsx', 'fast-xml-parser', 'fuse.js'];
  for (const dep of dependencies) {
    try {
      await execa('npm', ['install', dep, '--force']);
      console.log(`${dep} installed successfully.`);
    } catch (error) {
      console.error(`Error installing ${dep}:`, error);
    }
  }
};

const installEnhancedDependencies = async () => {
  const dependencies = ['fast-sort'];
  for (const dep of dependencies) {
    try {
      await execa('npm', ['install', dep, '--force']);
      console.log(`${dep} installed successfully.`);
    } catch (error) {
      console.error(`Error installing ${dep}:`, error);
    }
  }
};


const chooseProject = async () => {
  // Ask user to choose between projects
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'project',
      message: 'Which project would you like to work with?',
      choices: ['core', 'enhanced'],
      default: 'core',
    },
  ]);

  return answers.project;
};



const addCSSVariables = (cssContent) => {
  const rootAdditions = `
    --grid-overlay: 0 0% 100%;
    --grid-background: 0 0% 100%;
    --grid-foreground: 0 0% 3.9%;
    --grid-primary: 0 0% 100%;
    --grid-secondary: 0 0% 98.5%;
    --grid-accent: 200 50% 80%;
    --grid-border: 0 0% 70%;`;

  const darkAdditions = `
    --grid-overlay: 0 0% 3.9%;
    --grid-background: 0 0% 4%;
    --grid-foreground: 0 0% 98%;
    --grid-primary: 0 0% 4%;
    --grid-secondary: 0 0% 10%;
    --grid-accent: 200 50% 50%;
    --grid-border: 0 0% 14.9%;`;

  const insertVariables = (content, additions, selector) => {
    const selectorRegex = new RegExp(`${selector}\\s*{[^}]*}`);
    const match = content.match(selectorRegex);
    if (match) {
      const existingContent = match[0];
      const lastBrace = existingContent.lastIndexOf('}');
      const updatedContent = existingContent.slice(0, lastBrace) + additions + '\n  ' + existingContent.slice(lastBrace);
      return content.replace(selectorRegex, updatedContent);
    }
    return content;
  };

  cssContent = insertVariables(cssContent, rootAdditions, ':root');
  cssContent = insertVariables(cssContent, darkAdditions, '\\.dark');

  if (!cssContent.includes('@layer components {')) {
    cssContent += `\n${layerAdditions}`;
  }

  return cssContent;
};

const setupCoreProject = async () => {
  const { componentPath, installDeps } = await inquirer.prompt([
    {
      type: 'input',
      name: 'componentPath',
      message: 'Where do you want to install the component?',
      default: './src/lib/datagrid',
    },
    {
      type: 'confirm',
      name: 'installDeps',
      message: 'Do you want to install dependencies?',
      default: true,
    },
  ]);

  // Add these at the top of your file
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const sourcePath = path.join(__dirname, 'datagrid');
  const destPath = path.resolve(componentPath);

  // Copy the files
  await fs.copy(sourcePath, destPath);
  console.log("Tzezar's Datagrid Headless Core installed successfully!");

  if (installDeps) {
    console.log('Installing dependencies...');
    await installCoreDependencies();
    console.log('All dependencies installed successfully!');
  }
}

const setupEnhancedProject = async () => {
  const { componentPath, cssPath, tailwindConfigPath, installDeps } = await inquirer.prompt([
    {
      type: 'input',
      name: 'componentPath',
      message: 'Where do you want to install the component?',
      default: './src/lib/datagrid-enhanced',
    },
    {
      type: 'input',
      name: 'cssPath',
      message: 'Where is your global CSS file?',
      default: './src/app.css',
    },
    {
      type: 'input',
      name: 'tailwindConfigPath',
      message: 'Where is your tailwind.config.[cjs|js|ts] located?',
      default: './tailwind.config.ts',
    },
    {
      type: 'confirm',
      name: 'installDeps',
      message: 'Do you want to install dependencies?',
      default: true,
    },
  ]);

  // Add these at the top of your file
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const sourcePath = path.join(__dirname, 'datagrid-enhanced');
  const destPath = path.resolve(componentPath);

  // Copy the files
  await fs.copy(sourcePath, destPath);
  console.log("Tzezar's Datagrid component installed successfully!");

  // Modify app.css
  const cssContent = await fs.readFile(path.resolve(cssPath), 'utf8');
  const updatedCSSContent = addCSSVariables(cssContent);

  await fs.writeFile(path.resolve(cssPath), updatedCSSContent);
  console.log('app.css updated successfully!');

  // Modify tailwind.config.ts
  const tailwindConfig = await fs.readFile(path.resolve(tailwindConfigPath), 'utf8');
  
  // Check if colors object already exists in extend
  const colorsRegex = /extend:\s*{\s*colors:\s*{/;
  if (colorsRegex.test(tailwindConfig)) {
    // If colors already exists, add grid to it
    const updatedTailwindConfig = tailwindConfig.replace(
      /colors:\s*{/, 
      `colors: {
        grid: { 
          background: "hsl(var(--grid-background) / <alpha-value>)",
          foreground: "hsl(var(--grid-foreground) / <alpha-value>)",
          border: "hsl(var(--grid-border) / <alpha-value>)",
          overlay: "hsl(var(--grid-overlay) / <alpha-value>)",
          primary: "hsl(var(--grid-primary) / <alpha-value>)",
          secondary: "hsl(var(--grid-secondary) / <alpha-value>)",
          accent: "hsl(var(--grid-accent) / <alpha-value>)",
        },`
    );
    await fs.writeFile(path.resolve(tailwindConfigPath), updatedTailwindConfig);
  } else {
    // If colors doesn't exist, create it with grid
    const updatedTailwindConfig = tailwindConfig.replace(
      /extend:\s*{/, 
      `extend: {
      colors: {
        grid: {
          background: "hsl(var(--grid-background) / <alpha-value>)",
          foreground: "hsl(var(--grid-foreground) / <alpha-value>)",
          border: "hsl(var(--grid-border) / <alpha-value>)",
          overlay: "hsl(var(--grid-overlay) / <alpha-value>)",
          primary: "hsl(var(--grid-primary) / <alpha-value>)",
          secondary: "hsl(var(--grid-secondary) / <alpha-value>)",
          accent: "hsl(var(--grid-accent) / <alpha-value>)",
        },`
    );
    await fs.writeFile(path.resolve(tailwindConfigPath), updatedTailwindConfig);
  }
  
  console.log('tailwind.config.ts updated successfully!');

  if (installDeps) {
    console.log('Installing dependencies...');
    await installEnhancedDependencies();
    console.log('All dependencies installed successfully!');
  }
};




const setupProject = async () => {
  try {
    const project = await chooseProject();

    if (project === 'enhanced') {
      setupEnhancedProject();
    } else if (project === 'core') {
      setupCoreProject();
    } else {
      console.error('Invalid project choice.');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}



program
  .version('2.0.0')
  .description("CLI to install Tzezar's Datagrid Headless Core");

program
  .command('init')
  .description('Install Tzezar\'s Datagrid Headless Core')
  .action(setupProject);

program.parse(process.argv);
