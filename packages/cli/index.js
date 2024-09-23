#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { program } = require('commander');
const prompts = require('prompts');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
program
  .version('1.0.0')
  .description("CLI to install Tzezar's datagrid component and dependencies");

program
  .command('init')
  .description(`Install Tzezar's datagrid component`)
  .action(async () => {
    const questions = [
      {
        type: 'text',
        name: 'componentPath',
        message: 'Where do you want to install the component?',
        initial: './src/lib/components/datagrid'
      },
      {
        type: 'text',
        name: 'cssPath',
        message: 'Where is your global CSS file?',
        initial: './src/app.css'
      },
      {
        type: 'text',
        name: 'tailwindConfigPath',
        message: 'Where is your tailwind.config.[cjs|js|ts] located?',
        initial: './tailwind.config.ts'
      },
      {
        type: 'confirm',
        name: 'installDeps',
        message: 'Do you want to install dependencies?',
        initial: true
      }
    ];

    const answers = await prompts(questions);

    // Copy component files
    // const sourcePath = path.join(__dirname, 'components', 'datagrid');
    const sourcePath = "../../sites/docs/src/lib/datagrid"
    const destPath = path.resolve(answers.componentPath);

    try {
      await fs.copy(sourcePath, destPath);
      console.log("Tzezar's Datagrid component installed successfully!");

      // Modify app.css
      const cssPath = path.resolve(answers.cssPath);
      let cssContent = await fs.readFile(cssPath, 'utf8');

      const rootAdditions = `
    --table-primary: 0 0% 98%;
    --table-primary-hover: 0 0% 92%;
    --table-secondary: 0 0% 96%;
    --table-secondary-hover: 0 0% 92%;
    --table-row-odd: 0 0% 99%;
    --table-row-odd-hover: 0 0% 86%;
    --table-row-even: 0 0% 95%;
    --table-row-even-hover: 0 0% 89%;`;

      const darkAdditions = `
    --table-primary: 0 0% 9%;
    --table-primary-hover: 0 0% 5%;
    --table-secondary: 0 0% 10%;
    --table-secondary-hover: 0 0% 5%;
    --table-row-odd: 0 0% 9%;
    --table-row-odd-hover: 0 0% 5%;
    --table-row-even: 0 0% 10%;
    --table-row-even-hover: 0 0% 5%;`;

      // Function to insert new variables with correct indentation
      function insertVariables(content, additions, selector) {
        const selectorRegex = new RegExp(`${selector}\\s*{[^}]*}`);
        const match = content.match(selectorRegex);
        if (match) {
          const existingContent = match[0];
          const lastBrace = existingContent.lastIndexOf('}');
          const updatedContent = existingContent.slice(0, lastBrace) + additions + '\n  ' + existingContent.slice(lastBrace);
          return content.replace(selectorRegex, updatedContent);
        }
        return content;
      }

      cssContent = insertVariables(cssContent, rootAdditions, ':root');
      cssContent = insertVariables(cssContent, darkAdditions, '\\.dark');

      await fs.writeFile(cssPath, cssContent);
      console.log('app.css updated successfully!');

      // Modify tailwind.config.ts
      const tailwindConfigPath = path.resolve(answers.tailwindConfigPath);
      let tailwindConfig = await fs.readFile(tailwindConfigPath, 'utf8');

      const tableColors = `table: {
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
              },`;

      // Use a regular expression to find the colors object within the extend object
      const colorRegex = /extend:\s*{[^}]*colors:\s*{[^}]*}/;
      const match = tailwindConfig.match(colorRegex);

      if (match) {
        // If colors object exists, add table colors to it
        const updatedColors = match[0].replace(
          /colors:\s*{/,
          `colors: {\n        ${tableColors}`
        );
        tailwindConfig = tailwindConfig.replace(colorRegex, updatedColors);
      } else {
        // If colors object doesn't exist, add it with table colors
        tailwindConfig = tailwindConfig.replace(
          /extend:\s*{/,
          `extend: {\n    colors: {\n      ${tableColors}\n    },`
        );
      }

      await fs.writeFile(tailwindConfigPath, tailwindConfig);
      console.log('tailwind.config.ts updated successfully!');

      if (answers.installDeps) {
        console.log('Installing dependencies...');
        const dependencies = ['fast-sort', 'papaparse', 'xlsx', 'fast-xml-parser'];
        const installPromises = dependencies.map(dep =>
          execPromise(`npm i ${dep}`)
            .then(() => console.log(`${dep} installed successfully.`))
            .catch(error => console.error(`Error installing ${dep}:`, error))
        );

        await Promise.all(installPromises);
        console.log('All dependencies installed successfully!');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  });
program.parse(process.argv);


