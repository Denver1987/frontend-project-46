import { readFileSync } from 'node:fs';
import _ from 'lodash';

function parseJSONFile(filepath) {
  return JSON.parse(readFileSync(filepath, 'utf8'));
}

// eslint-disable-next-line consistent-return
function reduce(previous, key, obj1, obj2) {
  if (Object.hasOwn(obj1, key) && !Object.hasOwn(obj2, key)) return `${previous}\n  - ${key}: ${obj1[key]}`;
  if (!Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) return `${previous}\n  + ${key}: ${obj2[key]}`;
  if (obj1[key] === obj2[key]) return `${previous}\n    ${key}: ${obj1[key]}`;
  if (obj1[key] !== obj2[key]) return `${previous}\n  - ${key}: ${obj1[key]}\n  + ${key}: ${obj2[key]}`;
}

export default function showDifference(file1, file2) {
  const obj1 = parseJSONFile(file1);
  const obj2 = parseJSONFile(file2);
  let keys = _.union(Object.keys(obj1), Object.keys(obj2));
  keys = _.sortBy(keys);
  const result = keys.reduce((previous, key) => reduce(previous, key, obj1, obj2), '');
  return `{${result}\n}\n`;
}
