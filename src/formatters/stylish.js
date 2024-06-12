import _ from 'lodash';
import isObject from '../utils.js';
import {
  getStatus,
  getOldValue,
  getNewValue,
  getKeyName,
  getUnchangedValue,
  getInnerChangings,
} from '../differencers.js';

const INDENT = '    ';

export function printObject(obj, level) {
  const keys = Object.keys(obj);
  let result = '{';
  keys.forEach((key) => {
    if (isObject(obj[key])) {
      result += `\n${INDENT.repeat(level - 1)}    ${key}: ${printObject(obj[key], level + 1)}`;
    } else result += `\n${INDENT.repeat(level - 1)}    ${key}: ${obj[key]}`;
  });
  return `${result}\n${INDENT.repeat(level - 1)}}`;
}

function printUnchanged(key, obj1, level) {
  return `\n${INDENT.repeat(level - 1)}    ${key}: ${obj1}`;
}

function printAdded(key, obj2, level) {
  if (isObject(obj2)) {
    return `\n${INDENT.repeat(level - 1)}  + ${key}: ${printObject(obj2, level + 1)}`;
  } return `\n${INDENT.repeat(level - 1)}  + ${key}: ${obj2}`;
}

function printDelete(key, obj1, level) {
  if (isObject(obj1)) {
    return `\n${INDENT.repeat(level - 1)}  - ${key}: ${printObject(obj1, level + 1)}`;
  } return `\n${INDENT.repeat(level - 1)}  - ${key}: ${obj1}`;
}

function printChanged(key, obj1, obj2, level) {
  return `${printDelete(key, obj1, level)}${printAdded(key, obj2, level)}`;
}

export function formStylish(changingsTree) {
  const levelInitial = 1;

  function iter(changings, level) {
    let result = '';

    changings.forEach((key) => {
      if (getStatus(key) === 'nested') {
        result += `\n${INDENT.repeat(level - 1)}    ${getKeyName(key)}: ${iter(getInnerChangings(key), level + 1)}`;
      } else if (getStatus(key) === 'changed') result += printChanged(getKeyName(key), getOldValue(key), getNewValue(key), level);
      else if (getStatus(key) === 'unchanged') result += printUnchanged(getKeyName(key), getUnchangedValue(key), level);
      else if (getStatus(key) === 'added') result += printAdded(getKeyName(key), getNewValue(key), level);
      else if (getStatus(key) === 'deleted') result += printDelete(getKeyName(key), getOldValue(key), level);
    });
    return `{${result}\n${INDENT.repeat(level - 1)}}`;
  }
  return iter(changingsTree, levelInitial);
}
