#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { program } = require('commander');
const prompts = require('prompts');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
program
  .version('2.0.1')
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
        initial: './src/lib/datagrid'
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
    const sourcePath = path.join(__dirname, 'datagrid');
    const destPath = path.resolve(answers.componentPath);

    try {
      await fs.copy(sourcePath, destPath);
      console.log("Tzezar's Datagrid component installed successfully!");

      if (answers.installDeps) {
        console.log('Installing dependencies...');
        const dependencies = ['fast-sort', 'papaparse', 'xlsx', 'fast-xml-parser'];
        const installPromises = dependencies.map(dep =>
          execPromise(`npm i ${dep} --force`)
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

