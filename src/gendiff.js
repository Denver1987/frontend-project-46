// import { readFileSync } from 'node:fs';
import _ from 'lodash';
import parseFile from './parsers.js';

function isObject(variable) {
  return Object.prototype.toString.call(variable) === '[object Object]';
}

function printObject(obj, level) {
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

function formOutput(changings, obj1, obj2, level) {
  const keys = _.sortBy(Object.keys(changings));
  const indent = '    ';
  let result = '';
  const nextLevel = level + 1;
  keys.forEach((key) => {
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      result += `\n${indent.repeat(level - 1)}    ${key}: ${formOutput(differenceObjects(obj1[key], obj2[key]), obj1[key], obj2[key], nextLevel)}`;
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

export default function showDifference(file1, file2) {
  const obj1 = parseFile(file1);
  const obj2 = parseFile(file2);

  const changings = differenceObjects(obj1, obj2);
  // console.log(obj1, obj2);
  // console.log(printObject(obj1, 1));
  return `${formOutput(changings, obj1, obj2, 1)}\n`;
}
