#!/usr/bin/env node

import { program } from 'commander';
import path from 'node:path';

import showDifference from '../src/gendiff.js';

program
  .version('1.0.0')
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.');

program.option('-f, --format [type]', 'output format');

program.argument('<filepath1>')
  .argument('<filepath2>');

program.action((filepath1, filepath2) => {
  console.log(path.dirname(path.resolve(filepath1)));
  console.log(path.basename(path.resolve(filepath1)));
  console.log(path.extname(path.resolve(filepath1)));

  if (path.extname(path.resolve(filepath1)) === '.json' && path.extname(path.resolve(filepath2)) === '.json') {
    console.log(showDifference(filepath1, filepath2));
  }
});
program.parse(process.argv);
