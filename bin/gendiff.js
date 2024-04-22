#!/usr/bin/env node

import { program } from 'commander';

program
  .version('1.0.0')
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.');

program.option('-f, --format [type]', 'output format');

program.argument('<filepath1>')
  .argument('<filepath2>');

program.parse(process.argv);

console.log(process.argv);
