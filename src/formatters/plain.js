import { isObject } from '../utils.js';
import {
  getStatus,
  getKeyName,
  getInnerChangings,
  getValue,
} from '../differencers.js';

/**
 * Обрамляет значение в одинарные кавычки, если значение является строкой
 * @param {*} value
 * @returns {*}
 */
function closeInBrackets(value) {
  if (typeof value === 'string') return `'${value}'`;
  return value;
}

/**
 * Приводит переданное значение к строке [complex value], если значение является объектом,
 * обрамляет в кавычки, если значение является строкой, в остальных случаях не изменяет.
 * @param {*} value
 * @returns {*}
 */
function bringToRequired(value) {
  if (isObject(value)) return '[complex value]';
  return closeInBrackets(value);
}

/**
 * Возвращает строку, описывающюю изменения.
 * @param {Status} status тип изменения
 * @param {string} prop свойство
 * @param {*} value изменивщиеся значения
 * @param {string} propPrefix путь к свойству
 * @returns {string}
 */
// eslint-disable-next-line consistent-return
function printLine(status, prop, value, propPrefix) {
  if (status === 'changed') {
    const [oldValue, newValue] = value;
    return `Property '${propPrefix}${prop}' was updated. From ${bringToRequired(oldValue)} to ${bringToRequired(newValue)}\n`;
  }
  if (status === 'added') {
    return `Property '${propPrefix}${prop}' was added with value: ${bringToRequired(value)}\n`;
  }
  if (status === 'deleted') {
    return `Property '${propPrefix}${prop}' was removed\n`;
  }
  if (status === 'unchanged') return '';
}

/**
 * Формирует отчет в виде набора строк, описывающих изменения
 * @param {ChangingList} changingsTree список изменений
 * @returns {string}
 */
export default function formPlain(changingsTree) {
  const propPrefixInitial = '';
  function iter(changings, propPrefix) {
    // eslint-disable-next-line array-callback-return, consistent-return
    return changings.reduce((previous, changing) => {
      if (getStatus(changing) === 'nested') {
        const newPropPrefix = `${propPrefix}${getKeyName(changing)}.`;
        return `${previous}${iter(getInnerChangings(changing), newPropPrefix)}`;
      } return `${previous}${printLine(getStatus(changing), getKeyName(changing), getValue(changing), propPrefix)}`;
    }, '');
  }
  return iter(changingsTree, propPrefixInitial).slice(0, -1);
}
