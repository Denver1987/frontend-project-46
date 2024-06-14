import { isObject, isArray } from '../utils.js';
import {
  getStatus,
  getKeyName,
  getInnerChangings,
  getValue,
} from '../differencers.js';

const settings = {
  indent: '    ',
};

const prefixes = {
  unchanged: '    ',
  deleted: '  - ',
  added: '  + ',
};

function printObject(obj, level) {
  const keys = Object.keys(obj);
  const result = keys.reduce((previous, key) => {
    if (isObject(obj[key])) {
      return `${previous}\n${settings.indent.repeat(level - 1)}    ${key}: ${printObject(obj[key], level + 1)}`;
    }
    return `${previous}\n${settings.indent.repeat(level - 1)}    ${key}: ${obj[key]}`;
  }, '');
  return `{${result}\n${settings.indent.repeat(level - 1)}}`;
}

function printLine(key, value, level, prefix) {
  if (isArray(value)) {
    const [valueOld, valueNew] = value;
    return `${printLine(key, valueOld, level, prefixes.deleted)}${printLine(key, valueNew, level, prefixes.added)}`;
  }
  if (isObject(value)) {
    return `\n${settings.indent.repeat(level - 1)}${prefixes[prefix]}${key}: ${printObject(value, level + 1)}`;
  }
  return `\n${settings.indent.repeat(level - 1)}${prefixes[prefix]}${key}: ${value}`;
}

export default function formStylish(changingsTree) {
  const levelInitial = 1;
  const { indent } = settings;

  function iter(changings, level) {
    // eslint-disable-next-line array-callback-return, consistent-return
    const result = changings.reduce((previous, changing) => {
      if (getStatus(changing) === 'nested') {
        return `${previous}\n${indent.repeat(level - 1)}    ${getKeyName(changing)}: ${iter(getInnerChangings(changing), level + 1)}`;
      }
      return `${previous}${printLine(getKeyName(changing), getValue(changing), level, getStatus(changing))}`;
    }, '');
    return `{${result}\n${indent.repeat(level - 1)}}`;
  }
  return iter(changingsTree, levelInitial);
}
