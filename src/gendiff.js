// import { readFileSync } from 'node:fs';
import _ from 'lodash';
import parseFile from './parsers.js';

function isObject(variable) {
  return Object.prototype.toString.call(variable) === '[object Object]';
}

// eslint-disable-next-line consistent-return
function formatStylish(previous, key, obj1, obj2, level) {
  const indent = '  ';
  if (Object.hasOwn(obj1, key) && !Object.hasOwn(obj2, key)) return `${previous}\n${indent.repeat(level)}- ${key}: ${obj1[key]}`;
  if (!Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) return `${previous}\n${indent.repeat(level)}+ ${key}: ${obj2[key]}`;
  if (obj1[key] === obj2[key]) return `${previous}\n${indent.repeat(level)}  ${key}: ${obj1[key]}`;
  if (obj1[key] !== obj2[key]) return `${previous}\n${indent.repeat(level)}- ${key}: ${obj1[key]}\n${indent.repeat(level)}+ ${key}: ${obj2[key]}`;
}

function differenceObjects(obj1, obj2) {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2));
  const changings = {};
  keys.forEach((key) => {
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      changings[key] = differenceObjects(obj1[key], obj2[key]);
    } else if (Object.hasOwn(obj1, key) && !Object.hasOwn(obj2, key)) changings[key] = 'deleted';
    else if (!Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) changings[key] = 'added';
    else if (obj1[key] === obj2[key]) changings[key] = 'unchanged';
    else if (obj1[key] !== obj2[key]) changings[key] = 'changed';
  });
  return changings;
}

export default function showDifference(file1, file2) {
  const obj1 = parseFile(file1);
  const obj2 = parseFile(file2);
  const changings = differenceObjects(obj1, obj2);
}
