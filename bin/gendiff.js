#!/usr/bin/env node

import { program } from 'commander';

import showDifference from '../src/gendiff.js';

program
  .version('1.0.0')
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.');

program.option('-f, --format [type]', 'output format');

program.argument('<filepath1>')
  .argument('<filepath2>');

program.action((filepath1, filepath2) => {
  console.log(showDifference(filepath1, filepath2));
});
program.parse(process.argv);
