import _ from 'lodash';

export function isObject(variable) {
  return Object.prototype.toString.call(variable) === '[object Object]';
}

export function differenceObjects(obj1, obj2) {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2));
  const result = {};
  keys.forEach((key) => {
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      Object.assign(result, {
        [key]: {
          status: 'nested',
          value: differenceObjects(obj1[key], obj2[key]),
        },
      });
    } else if (Object.hasOwn(obj1, key) && !Object.hasOwn(obj2, key)) {
      result[key] = {
        status: 'deleted',
        oldValue: obj1[key],
      };
    } else if (!Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) {
      result[key] = {
        status: 'added',
        newValue: obj2[key],
      };
    } else if (obj1[key] === obj2[key]) {
      result[key] = {
        status: 'unchanged',
        value: obj2[key],
      };
    } else if (obj1[key] !== obj2[key]) {
      result[key] = {
        status: 'changed',
        oldValue: obj1[key],
        newValue: obj2[key],
      };
    }
  });
  return result;
}
