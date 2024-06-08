import parseFile from './parsers.js';
import { differenceObjects } from './differencers.js';
import { formStylish as formOutput } from './resultOutput.js';

export default function showDifference(file1, file2) {
  const obj1 = parseFile(file1);
  const obj2 = parseFile(file2);

  const changings = differenceObjects(obj1, obj2);
  return `${formOutput(changings, obj1, obj2, 1)}\n`;
}
