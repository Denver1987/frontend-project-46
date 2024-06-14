import _ from 'lodash';
import { isObject } from './utils.js';

// eslint-disable-next-line consistent-return
function makeChanging(key, obj1, obj2) {
  if (Object.hasOwn(obj1, key) && !Object.hasOwn(obj2, key)) {
    return [key, {
      status: 'deleted',
      value: obj1[key],
    }];
  } if (!Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) {
    return [key, {
      status: 'added',
      value: obj2[key],
    }];
  } if (obj1[key] === obj2[key]) {
    return [key, {
      status: 'unchanged',
      value: obj2[key],
    }];
  } if (obj1[key] !== obj2[key]) {
    return [key, {
      status: 'changed',
      value: [obj1[key], obj2[key]],
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

    return makeChanging(key, obj1, obj2);
  });
}

export function getStatus(changing) {
  return changing[1].status;
}

export function getKeyName(changing) {
  return changing[0];
}

export function getValue(changing) {
  switch (getStatus(changing)) {
    case 'added':
    case 'deleted':
    case 'unchanged':
    case 'changed': return changing[1].value;
    default: throw new Error('Нераспознанный статус изменения или узел содержит вложенный объект.');
  }
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

export function getChangingValues(changing) {
  return [changing[1].oldValue, changing[1].newValue];
}
