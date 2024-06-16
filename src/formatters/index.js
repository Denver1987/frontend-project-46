import formJson from './json.js';
import formPlain from './plain.js';
import formStylish from './stylish.js';

/**
 * Принимает список изменений changings и формирует вывод в соответствии с форматом format
 * @param {ChangingList} changings список изменений
 * @param {string} format формат вывода
 * @returns {string} результат
 */
// eslint-disable-next-line consistent-return
export default function printDifference(changings, format) {
  if (format === 'stylish') return formStylish(changings);
  if (format === 'plain') return formPlain(changings);
  if (format === 'json') return formJson(changings);
}
