import parseFile from './parsers.js';
import { differenceObjects } from './differencers.js';
import printDifference from './formatters/index.js';

// eslint-disable-next-line consistent-return
export default function genDiff(file1, file2, format = 'stylish') {
  const obj1 = parseFile(file1);
  const obj2 = parseFile(file2);

  const changings = differenceObjects(obj1, obj2);
  return printDifference(changings, format);
}
