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

// function printDeleted(indent, level, key ) {
//   return `${indent.repeat(level - 1)}  - ${key}: ${printObject(obj1[key], nextLevel)}`;
// }

export function formStylish(changings, obj1, obj2, level) {
  const keys = _.sortBy(Object.keys(changings));
  const indent = '    ';
  let result = '';
  const nextLevel = level + 1;
  keys.forEach((key) => {
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      result += `\n${indent.repeat(level - 1)}    ${key}: ${formStylish(differenceObjects(obj1[key], obj2[key]), obj1[key], obj2[key], nextLevel)}`;
    } else if (changings[key] === 'changed') {
      if (isObject(obj1[key]) && !isObject(obj2[key])) {
        result += `\n${indent.repeat(level - 1)}  - ${key}: ${printObject(obj1[key], nextLevel)}\n${indent.repeat(level - 1)}  + ${key}: ${obj2[key]}`;
      } else if (!isObject(obj1[key]) && isObject(obj2[key])) {
        result += `\n${indent.repeat(level - 1)}  - ${key}: ${obj1[key]}\n${indent.repeat(level - 1)}  + ${key}: ${printObject(obj2[key], nextLevel)}`;
      } else result += `\n${indent.repeat(level - 1)}  - ${key}: ${obj1[key]}\n${indent.repeat(level - 1)}  + ${key}: ${obj2[key]}`;
    } else if (changings[key] === 'unchanged') result += `\n${indent.repeat(level - 1)}    ${key}: ${obj1[key]}`;
    else if (changings[key] === 'added') {
      if (isObject(obj2[key])) {
        result += `\n${indent.repeat(level - 1)}  + ${key}: ${printObject(obj2[key], nextLevel)}`;
      } else result += `\n${indent.repeat(level - 1)}  + ${key}: ${obj2[key]}`;
    } else if (changings[key] === 'deleted') {
      if (isObject(obj1[key])) {
        result += `\n${indent.repeat(level - 1)}  - ${key}: ${printObject(obj1[key], nextLevel)}`;
      } else result += `\n${indent.repeat(level - 1)}  - ${key}: ${obj1[key]}`;
    }
  });
  return `{${result}\n${indent.repeat(level - 1)}}`;
}
