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

  function printUnchanged(key, obj1, level) {
    return `\n${indent.repeat(level - 1)}    ${key}: ${obj1}`;
  }

  function printAdded(key, obj2, level) {
    if (isObject(obj2)) {
      return `\n${indent.repeat(level - 1)}  + ${key}: ${printObject(obj2, level + 1)}`;
    } return `\n${indent.repeat(level - 1)}  + ${key}: ${obj2}`;
  }

  function printDelete(key, obj1, level) {
    if (isObject(obj1)) {
      return `\n${indent.repeat(level - 1)}  - ${key}: ${printObject(obj1, level + 1)}`;
    } return `\n${indent.repeat(level - 1)}  - ${key}: ${obj1}`;
  }

  function printChanged(key, obj1, obj2, level) {
    return `${printDelete(key, obj1, level)}${printAdded(key, obj2, level)}`;
  }

  function iter(changings, level) {
    // eslint-disable-next-line array-callback-return, consistent-return
    const result = changings.reduce((previous, key) => {
      if (getStatus(key) === 'nested') {
        return `${previous}\n${indent.repeat(level - 1)}    ${getKeyName(key)}: ${iter(getInnerChangings(key), level + 1)}`;
      } if (getStatus(key) === 'changed') return `${previous}${printChanged(getKeyName(key), getOldValue(key), getNewValue(key), level)}`;
      if (getStatus(key) === 'unchanged') return `${previous}${printUnchanged(getKeyName(key), getUnchangedValue(key), level)}`;
      if (getStatus(key) === 'added') return `${previous}${printAdded(getKeyName(key), getNewValue(key), level)}`;
      if (getStatus(key) === 'deleted') return `${previous}${printDelete(getKeyName(key), getOldValue(key), level)}`;
    }, '');
    return `{${result}\n${indent.repeat(level - 1)}}`;
  }
  return iter(changingsTree, levelInitial);
}
