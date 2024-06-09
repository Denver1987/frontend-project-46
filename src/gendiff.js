import parseFile from './parsers.js';
import { differenceObjects } from './differencers.js';
import { formStylish } from './formatters/stylish.js';
import formPlain from './formatters/plain.js';

// eslint-disable-next-line consistent-return
export default function showDifference(file1, file2, format) {
  const obj1 = parseFile(file1);
  const obj2 = parseFile(file2);

  const changings = differenceObjects(obj1, obj2);
  if (format === 'stylish') return `${formStylish(changings, obj1, obj2)}\n`;
  if (format === 'plain') return `${formPlain(changings, obj1, obj2)}`;
}
