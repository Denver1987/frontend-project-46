import isObject from '../utils.js';
import {
  getStatus,
  getOldValue,
  getNewValue,
  getKeyName,
  getUnchangedValue,
  getInnerChangings,
} from '../differencers.js';

export default function formStylish(changingsTree) {
  const levelInitial = 1;
  const indent = '    ';

  const prefixes = {
    unchanged: '    ',
    deleted: '  - ',
    added: '  + ',
  };

  function printObject(obj, level) {
    const keys = Object.keys(obj);
    const result = keys.reduce((previous, key) => {
      if (isObject(obj[key])) {
        return `${previous}\n${indent.repeat(level - 1)}    ${key}: ${printObject(obj[key], level + 1)}`;
      }
      return `${previous}\n${indent.repeat(level - 1)}    ${key}: ${obj[key]}`;
    }, '');
    return `{${result}\n${indent.repeat(level - 1)}}`;
  }

  // function printUnchanged(key, obj1, level) {
  //   return `\n${indent.repeat(level - 1)}    ${key}: ${obj1}`;
  // }

  // function printAdded(key, obj2, level) {
  //   if (isObject(obj2)) {
  //     return `\n${indent.repeat(level - 1)}  + ${key}: ${printObject(obj2, level + 1)}`;
  //   } return `\n${indent.repeat(level - 1)}  + ${key}: ${obj2}`;
  // }

  // function printDelete(key, obj1, level) {
  //   if (isObject(obj1)) {
  //     return `\n${indent.repeat(level - 1)}  - ${key}: ${printObject(obj1, level + 1)}`;
  //   } return `\n${indent.repeat(level - 1)}  - ${key}: ${obj1}`;
  // }

  function printSingleLine(key, value, level, prefix) {
    if (isObject(value)) {
      return `\n${indent.repeat(level - 1)}${prefix}${key}: ${printObject(value, level + 1)}`;
    }
    return `\n${indent.repeat(level - 1)}${prefix}${key}: ${value}`;
  }

  function printChanged(key, obj1, obj2, level) {
    return `${printSingleLine(key, obj1, level, prefixes.deleted)}${printSingleLine(key, obj2, level, prefixes.added)}`;
  }

  function iter(changings, level) {
    // eslint-disable-next-line array-callback-return, consistent-return
    const result = changings.reduce((previous, key) => {
      if (getStatus(key) === 'nested') {
        return `${previous}\n${indent.repeat(level - 1)}    ${getKeyName(key)}: ${iter(getInnerChangings(key), level + 1)}`;
      } if (getStatus(key) === 'changed') return `${previous}${printChanged(getKeyName(key), getOldValue(key), getNewValue(key), level)}`;
      if (getStatus(key) === 'unchanged') return `${previous}${printSingleLine(getKeyName(key), getUnchangedValue(key), level, prefixes.unchanged)}`;
      if (getStatus(key) === 'added') return `${previous}${printSingleLine(getKeyName(key), getNewValue(key), level, prefixes.added)}`;
      if (getStatus(key) === 'deleted') return `${previous}${printSingleLine(getKeyName(key), getOldValue(key), level, prefixes.deleted)}`;
    }, '');
    return `{${result}\n${indent.repeat(level - 1)}}`;
  }
  return iter(changingsTree, levelInitial);
}
