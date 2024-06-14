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
    // eslint-disable-next-line array-callback-return, consistent-return
    return changings.reduce((previous, changing) => {
      if (getStatus(changing) === 'nested') {
        const newPropPrefix = `${propPrefix}${getKeyName(changing)}.`;
        return `${previous}${iter(getInnerChangings(changing), newPropPrefix)}`;
      } if (getStatus(changing) === 'added') return `${previous}${printAdded(getKeyName(changing), getValue(changing), propPrefix)}`;
      if (getStatus(changing) === 'deleted') return `${previous}${printDeleted(getKeyName(changing), propPrefix)}`;
      if (getStatus(changing) === 'changed') return `${previous}${printChanged(getKeyName(changing), ...getValue(changing), propPrefix)}`;
      if (getStatus(changing) === 'unchanged') return `${previous}`;
    }, '');
  }
  return iter(changingsTree, propPrefixInitial).slice(0, -1);
}
