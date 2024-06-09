import path from 'node:path';
import yaml from 'js-yaml';
import { readFileSync } from 'node:fs';

// eslint-disable-next-line consistent-return
export default function parseFile(file) {
  if (path.extname(file) === '.json') {
    return JSON.parse(readFileSync(file, 'utf8'));
  }
  if (path.extname(file) === '.yml' || path.extname(file) === '.yaml') {
    return yaml.load(readFileSync(file, 'utf-8'));
  }
}
