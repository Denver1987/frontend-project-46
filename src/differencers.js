import _ from 'lodash';

export function isObject(variable) {
  return Object.prototype.toString.call(variable) === '[object Object]';
}

export function differenceObjects(obj1, obj2) {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2));
  const changings = {};
  keys.forEach((key) => {
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      changings[key] = differenceObjects(obj1[key], obj2[key]);
    } else if (Object.hasOwn(obj1, key) && !Object.hasOwn(obj2, key)) changings[key] = 'deleted';
    else if (!Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) changings[key] = 'added';
    else if (obj1[key] === obj2[key]) changings[key] = 'unchanged';
    else if (obj1[key] !== obj2[key]) changings[key] = 'changed';
  });
  return changings;
}
