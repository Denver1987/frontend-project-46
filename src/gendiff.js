import parseFile from './parsers.js';
import { differenceObjects } from './differencers.js';
import printDifference from './formatters/index.js';

/**
 * Парсит файлы и формирует отчет в соответствующем формате
 * @param {string} file1 исходный файл
 * @param {string} file2 измененный файл
 * @param {string} format формат вывода отчета
 * @returns {string} результат в соответствующем формате
 */
// eslint-disable-next-line consistent-return
export default function genDiff(file1, file2, format = 'stylish') {
  const obj1 = parseFile(file1);
  const obj2 = parseFile(file2);

  const changings = differenceObjects(obj1, obj2);
  return printDifference(changings, format);
}
