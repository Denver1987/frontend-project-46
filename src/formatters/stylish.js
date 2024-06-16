import { isObject, isArray } from '../utils.js';
import {
  getStatus,
  getKeyName,
  getInnerChangings,
  getValue,
} from '../differencers.js';

const settings = {
  indent: '    ',
};

const prefixes = {
  unchanged: '    ',
  deleted: '  - ',
  added: '  + ',
};

/**
 * Формирует строку, содержащюю объект уровня вложенности level
 * @param {Object} obj объект, который требуется вывести на печать
 * @param {number} level уровень вложенности
 * @returns {string}
 */
function printObject(obj, level) {
  const keys = Object.keys(obj);
  const result = keys.reduce((previous, key) => {
    if (isObject(obj[key])) {
      return `${previous}\n${settings.indent.repeat(level - 1)}    ${key}: ${printObject(obj[key], level + 1)}`;
    }
    return `${previous}\n${settings.indent.repeat(level - 1)}    ${key}: ${obj[key]}`;
  }, '');
  return `{${result}\n${settings.indent.repeat(level - 1)}}`;
}

/**
 * Формирует строку, описывающюю изменение в виде пары ключ: значение
 * @param {string} prop свойство
 * @param {*} value изменившееся значение
 * @param {number} level уровень вложенности
 * @param {string} prefix тип изменений
 * @returns {string}
 */
function printLine(prop, value, level, prefix) {
  if (isArray(value)) {
    const [valueOld, valueNew] = value;
    return `${printLine(prop, valueOld, level, 'deleted')}${printLine(prop, valueNew, level, 'added')}`;
  }
  if (isObject(value)) {
    return `\n${settings.indent.repeat(level - 1)}${prefixes[prefix]}${prop}: ${printObject(value, level + 1)}`;
  }
  return `\n${settings.indent.repeat(level - 1)}${prefixes[prefix]}${prop}: ${value}`;
}

/**
 * Формирует отчет изменений в виде объекта
 * @param {ChangingList} changingsTree список изменений
 * @returns {string}
 */
export default function formStylish(changingsTree) {
  const levelInitial = 1;
  const { indent } = settings;

  function iter(changings, level) {
    // eslint-disable-next-line array-callback-return, consistent-return
    const result = changings.reduce((previous, changing) => {
      if (getStatus(changing) === 'nested') {
        return `${previous}\n${indent.repeat(level - 1)}    ${getKeyName(changing)}: ${iter(getInnerChangings(changing), level + 1)}`;
      }
      return `${previous}${printLine(getKeyName(changing), getValue(changing), level, getStatus(changing))}`;
    }, '');

    return `{${result}\n${indent.repeat(level - 1)}}`;
  }
  return iter(changingsTree, levelInitial);
}
