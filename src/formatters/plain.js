import _ from 'lodash';
import { isObject } from '../differencers.js';

function closeInQuotes(value) {
  if (typeof value === 'string') return `'${value}'`;
  return value;
}

function printAdded(prop, value, propPrefix) {
  if (isObject(value)) return `Property '${propPrefix}${prop}' was added with value: [complex value]\n`;
  return `Property '${propPrefix}${prop}' was added with value: ${closeInQuotes(value)}\n`;
}

function printDeleted(prop, propPrefix) {
  return `Property '${propPrefix}${prop}' was removed\n`;
}

function printChanged(prop, oldValue, newValue, propPrefix) {
  if (isObject(oldValue)) return `Property '${propPrefix}${prop}' was updated. From [complex value] to ${closeInQuotes(newValue)}\n`;
  if (isObject(newValue)) return `Property '${propPrefix}${prop}' was updated. From ${closeInQuotes(oldValue)} to [complex value]\n`;
  return `Property '${propPrefix}${prop}' was updated. From ${closeInQuotes(oldValue)} to ${closeInQuotes(newValue)}\n`;
}

export default function formPlain(changings, obj1, obj2, propPrefix = '') {
  const keys = _.sortBy(Object.keys(changings));

  let result = '';
  keys.forEach((key) => {
    if (isObject(changings[key])) {
      result += formPlain(changings[key], obj1[key], obj2[key], `${propPrefix}${key}.`);
    } else if (changings[key] === 'added') result += `${printAdded(key, obj2[key], propPrefix)}`;
    else if (changings[key] === 'deleted') result += `${printDeleted(key, propPrefix)}`;
    else if (changings[key] === 'changed') result += `${printChanged(key, obj1[key], obj2[key], propPrefix)}`;
  });
  return result;
}
