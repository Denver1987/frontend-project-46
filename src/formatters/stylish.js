import _ from 'lodash';
import { isObject } from '../differencers.js';

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
    const keys = _.sortBy(Object.keys(changings));
    let result = '';

    keys.forEach((key) => {
      if (changings[key].status === 'nested') {
        result += `\n${INDENT.repeat(level - 1)}    ${key}: ${iter(changings[key].value, level + 1)}`;
      } else if (changings[key].status === 'changed') result += printChanged(key, changings[key].oldValue, changings[key].newValue, level);
      else if (changings[key].status === 'unchanged') result += printUnchanged(key, changings[key].value, level);
      else if (changings[key].status === 'added') result += printAdded(key, changings[key].newValue, level);
      else if (changings[key].status === 'deleted') result += printDelete(key, changings[key].oldValue, level);
    });
    return `{${result}\n${INDENT.repeat(level - 1)}}`;
  }
  return iter(changingsTree, levelInitial);
}
