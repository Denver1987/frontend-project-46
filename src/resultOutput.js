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

function printAdded(key, obj2, indent, level, nextLevel) {
  if (isObject(obj2[key])) {
    return `\n${indent.repeat(level - 1)}  + ${key}: ${printObject(obj2[key], nextLevel)}`;
  } return `\n${indent.repeat(level - 1)}  + ${key}: ${obj2[key]}`;
}

function printDelete(key, obj1, indent, level, nextLevel) {
  if (isObject(obj1[key])) {
    return `\n${indent.repeat(level - 1)}  - ${key}: ${printObject(obj1[key], nextLevel)}`;
  } return `\n${indent.repeat(level - 1)}  - ${key}: ${obj1[key]}`;
}

function printChanged(key, obj1, obj2, indent, level, nextLevel) {
  return `${printDelete(key, obj1, indent, level, nextLevel)}${printAdded(key, obj2, indent, level, nextLevel)}`;
}

function printInnerChangedObject(key, obj1, obj2, indent, level, nextLevel) {
  // eslint-disable-next-line no-use-before-define
  return `\n${indent.repeat(level - 1)}    ${key}: ${formStylish(differenceObjects(obj1[key], obj2[key]), obj1[key], obj2[key], nextLevel)}`;
}

export function formStylish(changings, obj1, obj2, level) {
  const keys = _.sortBy(Object.keys(changings));
  const indent = '    ';
  let result = '';
  const nextLevel = level + 1;

  keys.forEach((key) => {
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      result += printInnerChangedObject(key, obj1, obj2, indent, level, nextLevel);
    } else if (changings[key] === 'changed') result += printChanged(key, obj1, obj2, indent, level, nextLevel);
    else if (changings[key] === 'unchanged') result += printUnchanged(key, obj1, indent, level);
    else if (changings[key] === 'added') result += printAdded(key, obj2, indent, level, nextLevel);
    else if (changings[key] === 'deleted') result += printDelete(key, obj1, indent, level, nextLevel);
  });
  return `{${result}\n${indent.repeat(level - 1)}}`;
}
