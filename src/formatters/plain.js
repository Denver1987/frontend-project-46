import _ from 'lodash';
import { isObject } from '../differencers.js';

function closeInBrackets(value) {
  if (typeof value === 'string') return `'${value}'`;
  return value;
}

function printAdded(prop, value, propPrefix) {
  if (isObject(value)) return `Property '${propPrefix}${prop}' was added with value: [complex value]\n`;
  return `Property '${propPrefix}${prop}' was added with value: ${closeInBrackets(value)}\n`;
}

function printDeleted(prop, propPrefix) {
  return `Property '${propPrefix}${prop}' was removed\n`;
}

function printChanged(prop, oldValue, newValue, propPrefix) {
  if (isObject(oldValue)) return `Property '${propPrefix}${prop}' was updated. From [complex value] to ${closeInBrackets(newValue)}\n`;
  if (isObject(newValue)) return `Property '${propPrefix}${prop}' was updated. From ${closeInBrackets(oldValue)} to [complex value]\n`;
  return `Property '${propPrefix}${prop}' was updated. From ${closeInBrackets(oldValue)} to ${closeInBrackets(newValue)}\n`;
}

export default function formPlain(changingsTree) {
  const propPrefixInitial = '';
  function iter(changings, propPrefix) {
    const keys = _.sortBy(Object.keys(changings));
    let result = '';
    keys.forEach((key) => {
      if (changings[key].status === 'nested') {
        result += iter(changings[key].value, `${propPrefix}${key}.`);
      } else if (changings[key].status === 'added') result += `${printAdded(key, changings[key].newValue, propPrefix)}`;
      else if (changings[key].status === 'deleted') result += `${printDeleted(key, propPrefix)}`;
      else if (changings[key].status === 'changed') result += `${printChanged(key, changings[key].oldValue, changings[key].newValue, propPrefix)}`;
    });
    return result;
  }
  return `${iter(changingsTree, propPrefixInitial).slice(0, -1)}`;
}
