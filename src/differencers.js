import _ from 'lodash';
import isObject from './utils.js';

// eslint-disable-next-line consistent-return
function getChanging(key, obj1, obj2) {
  if (Object.hasOwn(obj1, key) && !Object.hasOwn(obj2, key)) {
    return [key,
      {
        status: 'deleted',
        oldValue: obj1[key],
      }];
  } if (!Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) {
    return [key,
      {
        status: 'added',
        newValue: obj2[key],
      }];
  } if (obj1[key] === obj2[key]) {
    return [key,
      {
        status: 'unchanged',
        value: obj2[key],
      }];
  } if (obj1[key] !== obj2[key]) {
    return [key,
      {
        status: 'changed',
        oldValue: obj1[key],
        newValue: obj2[key],
      }];
  }
}

export function differenceObjects(obj1, obj2) {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2));
  const sortedKeys = _.sortBy(keys);

  return sortedKeys.map((key) => {
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      return [key,
        {
          status: 'nested',
          child: differenceObjects(obj1[key], obj2[key]),
        }];
    }

    return getChanging(key, obj1, obj2);
  });
}

export function getStatus(chenging) {
  return chenging[1].status;
}

export function getKeyName(chenging) {
  return chenging[0];
}

export function getOldValue(chenging) {
  return chenging[1].oldValue;
}

export function getNewValue(chenging) {
  return chenging[1].newValue;
}

export function getUnchangedValue(chenging) {
  return chenging[1].value;
}

export function getInnerChangings(changing) {
  return changing[1].child;
}
