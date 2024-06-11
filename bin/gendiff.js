#!/usr/bin/env node

import { program } from 'commander';
// import path from 'node:path';

import showDifference from '../src/gendiff.js';

program
  .version('1.0.0')
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.');

program.option('-f, --format [type]', 'output format', 'stylish');

program.argument('<filepath1>')
  .argument('<filepath2>');

const options = program.opts();

program.action((filepath1, filepath2) => {
  console.log(showDifference(filepath1, filepath2, options.format));
  // console.log(options);
});
program.parse();
