import { readFileSync } from 'node:fs';
import _ from 'lodash';

function parseJSONFile(filepath) {
  return JSON.parse(readFileSync(filepath, 'utf8'));
}

export default function showDifference(file1, file2) {
  const obj1 = parseJSONFile(file1);
  const obj2 = parseJSONFile(file2);
  let keys = _.union(Object.keys(obj1), Object.keys(obj2));
  keys = _.sortBy(keys);
  // eslint-disable-next-line array-callback-return, consistent-return
  const result = keys.reduce((previous, key) => {
    if (Object.hasOwn(obj1, key) && !Object.hasOwn(obj2, key)) return `${previous}\n  - ${key}: ${obj1[key]}`;
    if (!Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) return `${previous}\n  + ${key}: ${obj2[key]}`;
    if (obj1[key] === obj2[key]) return `${previous}\n    ${key}: ${obj1[key]}`;
    if (obj1[key] !== obj2[key]) return `${previous}\n  - ${key}: ${obj1[key]}\n  + ${key}: ${obj2[key]}`;
  }, '');
  return `{${result}\n}\n`;
}
