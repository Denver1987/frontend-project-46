// import { readFileSync } from 'node:fs';
import _ from 'lodash';
import parseFile from './parsers.js';
import { differenceObjects, isObject } from './differencers.js';
import { printObject, formStylish as formOutput } from './resultOutput.js';

// function formOutput(changings, obj1, obj2, level) {
//   const keys = _.sortBy(Object.keys(changings));
//   const indent = '    ';
//   let result = '';
//   const nextLevel = level + 1;
//   keys.forEach((key) => {
//     if (isObject(obj1[key]) && isObject(obj2[key])) {
//       result += `\n${indent.repeat(level - 1)}    ${key}: ${formOutput(differenceObjects(obj1[key], obj2[key]), obj1[key], obj2[key], nextLevel)}`;
//     } else if (changings[key] === 'changed') {
//       if (isObject(obj1[key]) && !isObject(obj2[key])) {
//         result += `\n${indent.repeat(level - 1)}  - ${key}: ${printObject(obj1[key], nextLevel)}\n${indent.repeat(level - 1)}  + ${key}: ${obj2[key]}`;
//       } else if (!isObject(obj1[key]) && isObject(obj2[key])) {
//         result += `\n${indent.repeat(level - 1)}  - ${key}: ${obj1[key]}\n${indent.repeat(level - 1)}  + ${key}: ${printObject(obj2[key], nextLevel)}`;
//       } else result += `\n${indent.repeat(level - 1)}  - ${key}: ${obj1[key]}\n${indent.repeat(level - 1)}  + ${key}: ${obj2[key]}`;
//     } else if (changings[key] === 'unchanged') result += `\n${indent.repeat(level - 1)}    ${key}: ${obj1[key]}`;
//     else if (changings[key] === 'added') {
//       if (isObject(obj2[key])) {
//         result += `\n${indent.repeat(level - 1)}  + ${key}: ${printObject(obj2[key], nextLevel)}`;
//       } else result += `\n${indent.repeat(level - 1)}  + ${key}: ${obj2[key]}`;
//     } else if (changings[key] === 'deleted') {
//       if (isObject(obj1[key])) {
//         result += `\n${indent.repeat(level - 1)}  - ${key}: ${printObject(obj1[key], nextLevel)}`;
//       } else result += `\n${indent.repeat(level - 1)}  - ${key}: ${obj1[key]}`;
//     }
//   });
//   return `{${result}\n${indent.repeat(level - 1)}}`;
// }

export default function showDifference(file1, file2) {
  const obj1 = parseFile(file1);
  const obj2 = parseFile(file2);

  const changings = differenceObjects(obj1, obj2);
  return `${formOutput(changings, obj1, obj2, 1)}\n`;
}
