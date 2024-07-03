#!/usr/bin/env node

const program = require('commander');
const { prompt } = require('inquirer');
const { generateStructure } = require('../lib/generate-structure');
const { detectProjectType } = require('../lib/detect-project-type');

program
  .version('1.0.0')
  .description('Generate project folder structure');

program
  .action(async () => {
    const detectedType = await detectProjectType();
    
    const questions = [
      {
        type: 'list',
        name: 'projectType',
        message: 'Select project type:',
        choices: ['react', 'express', 'vue', 'angular', 'static'],
        default: detectedType
      },
      {
        type: 'input',
        name: 'projectName',
        message: 'Enter project name:'
      },
      {
        type: 'confirm',
        name: 'customDependencies',
        message: 'Do you want to add custom dependencies?',
        default: false
      },
      {
        type: 'input',
        name: 'dependencies',
        message: 'Enter custom dependencies (comma-separated):',
        when: (answers) => answers.customDependencies,
        filter: (input) => input.split(',').map(dep => dep.trim())
      },
      {
        type: 'confirm',
        name: 'useTypeScript',
        message: 'Do you want to use TypeScript?',
        default: false
      },
      {
        type: 'confirm',
        name: 'includeTesting',
        message: 'Do you want to include testing setup?',
        default: true
      }
    ];

    const answers = await prompt(questions);
    await generateStructure(answers);
    console.log(`Project ${answers.projectName} created successfully!`);
  });

program.parse(process.argv);