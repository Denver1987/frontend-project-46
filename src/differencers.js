import _ from 'lodash';
import { isObject } from './utils.js';

// eslint-disable-next-line consistent-return
function makeChanging(key, obj1, obj2) {
  if (Object.hasOwn(obj1, key) && !Object.hasOwn(obj2, key)) {
    return {
      key,
      status: 'deleted',
      value: obj1[key],
    };
  } if (!Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) {
    return {
      key,
      status: 'added',
      value: obj2[key],
    };
  } if (obj1[key] === obj2[key]) {
    return {
      key,
      status: 'unchanged',
      value: obj2[key],
    };
  } return {
    key,
    status: 'changed',
    value: [obj1[key], obj2[key]],
  };
}

export function differenceObjects(obj1, obj2) {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2));
  const sortedKeys = _.sortBy(keys);

  return sortedKeys.map((key) => {
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      return {
        key,
        status: 'nested',
        child: differenceObjects(obj1[key], obj2[key]),
      };
    }

    return makeChanging(key, obj1, obj2);
  });
}

export function getStatus(changing) {
  return changing.status;
}

export function getKeyName(changing) {
  return changing.key;
}

// eslint-disable-next-line consistent-return
export function getValue(changing) {
  // eslint-disable-next-line default-case
  switch (getStatus(changing)) {
    case 'added':
    case 'deleted':
    case 'unchanged':
    case 'changed': return changing.value;
  }
}

export function getInnerChangings(changing) {
  return changing.child;
}
