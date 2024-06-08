import _ from 'lodash';
import { isObject, differenceObjects } from './differencers.js';

export function printObject(obj, level) {
  const keys = Object.keys(obj);
  const indent = '    ';
  let result = '{';
  keys.forEach((key) => {
    if (isObject(obj[key])) {
      const nextLevel = level + 1;
      result += `\n${indent.repeat(level - 1)}    ${key}: ${printObject(obj[key], nextLevel)}`;
    } else result += `\n${indent.repeat(level - 1)}    ${key}: ${obj[key]}`;
  });
  return `${result}\n${indent.repeat(level - 1)}}`;
}

function printUnchanged(key, obj1, indent, level) {
  return `\n${indent.repeat(level - 1)}    ${key}: ${obj1[key]}`;
}

export function formStylish(changings, obj1, obj2, level) {
  const keys = _.sortBy(Object.keys(changings));
  const indent = '    ';
  let result = '';
  const nextLevel = level + 1;

  function printAdded(key) {
    if (isObject(obj2[key])) {
      result += `\n${indent.repeat(level - 1)}  + ${key}: ${printObject(obj2[key], nextLevel)}`;
    } else result += `\n${indent.repeat(level - 1)}  + ${key}: ${obj2[key]}`;
  }

  function printDelete(key) {
    if (isObject(obj1[key])) {
      result += `\n${indent.repeat(level - 1)}  - ${key}: ${printObject(obj1[key], nextLevel)}`;
    } else result += `\n${indent.repeat(level - 1)}  - ${key}: ${obj1[key]}`;
  }

  function printChanged(key) {
    printDelete(key);
    printAdded(key);
  }

  function printInnerChangedObject(key) {
    result += `\n${indent.repeat(level - 1)}    ${key}: ${formStylish(differenceObjects(obj1[key], obj2[key]), obj1[key], obj2[key], nextLevel)}`;
  }

  keys.forEach((key) => {
    if (isObject(obj1[key]) && isObject(obj2[key])) printInnerChangedObject(key);
    else if (changings[key] === 'changed') printChanged(key);
    else if (changings[key] === 'unchanged') result += printUnchanged(key, obj1, obj2, indent, level);
    else if (changings[key] === 'added') printAdded(key);
    else if (changings[key] === 'deleted') printDelete(key);
  });
  return `{${result}\n${indent.repeat(level - 1)}}`;
}
