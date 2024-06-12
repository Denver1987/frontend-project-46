import isObject from '../utils.js';
import {
  getStatus,
  getOldValue,
  getNewValue,
  getKeyName,
  getInnerChangings,
} from '../differencers.js';

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
  console.log(changingsTree);
  function iter(changings, propPrefix) {
    // eslint-disable-next-line array-callback-return, consistent-return
    return changings.reduce((previous, key) => {
      if (getStatus(key) === 'nested') {
        const newPropPrefix = `${propPrefix}${getKeyName(key)}.`;
        return `${previous}${iter(getInnerChangings(key), newPropPrefix)}`;
      } if (getStatus(key) === 'added') return `${previous}${printAdded(getKeyName(key), getNewValue(key), propPrefix)}`;
      if (getStatus(key) === 'deleted') return `${previous}${printDeleted(getKeyName(key), propPrefix)}`;
      if (getStatus(key) === 'changed') return `${previous}${printChanged(getKeyName(key), getOldValue(key), getNewValue(key), propPrefix)}`;
      if (getStatus(key) === 'unchanged') return `${previous}`;
    }, '');
  }
  return iter(changingsTree, propPrefixInitial).slice(0, -1);
}
