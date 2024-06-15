import { isObject } from '../utils.js';
import {
  getStatus,
  getKeyName,
  getInnerChangings,
  getValue,
} from '../differencers.js';

function closeInBrackets(value) {
  if (typeof value === 'string') return `'${value}'`;
  return value;
}

function bringToRequired(value) {
  if (isObject(value)) return '[complex value]';
  return closeInBrackets(value);
}

// eslint-disable-next-line consistent-return
function printLine(status, prop, value, propPrefix) {
  if (status === 'changed') {
    const [oldValue, newValue] = value;
    return `Property '${propPrefix}${prop}' was updated. From ${bringToRequired(oldValue)} to ${bringToRequired(newValue)}\n`;
  }
  if (status === 'added') {
    return `Property '${propPrefix}${prop}' was added with value: ${bringToRequired(value)}\n`;
  }
  if (status === 'deleted') {
    return `Property '${propPrefix}${prop}' was removed\n`;
  }
  if (status === 'unchanged') return '';
}

export default function formPlain(changingsTree) {
  const propPrefixInitial = '';
  function iter(changings, propPrefix) {
    // eslint-disable-next-line array-callback-return, consistent-return
    return changings.reduce((previous, changing) => {
      if (getStatus(changing) === 'nested') {
        const newPropPrefix = `${propPrefix}${getKeyName(changing)}.`;
        return `${previous}${iter(getInnerChangings(changing), newPropPrefix)}`;
      } return `${previous}${printLine(getStatus(changing), getKeyName(changing), getValue(changing), propPrefix)}`;
    }, '');
  }
  return iter(changingsTree, propPrefixInitial).slice(0, -1);
}
