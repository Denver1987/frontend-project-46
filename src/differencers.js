import _ from 'lodash';
import { isObject } from './utils.js';

/**
 * Анализирует свойство key в переданных объектах и возвращает объект,
 * описывающий изменение
 * @param {string} key проверяемые свойство
 * @param {Object} obj1 исходный объект
 * @param {Object} obj2 измененный объект
 * @returns {Changing} объект описывающий изменение
 */
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

/**
 * Формирует список изменений в двух объектах в виде массива изменений.
 * Способна проверить вложенные объекты.
 * @param {} obj1 исходный объект
 * @param {*} obj2 измененный объект
 * @returns {ChangingList}
 */
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

/**
 * Возвращает тип изменения.
 * @param {Changing} changing
 * @returns {Status}
 */
export function getStatus(changing) {
  return changing.status;
}

/**
 * Возвращает имя свойства из изменения
 * @param {Changing} changing
 * @returns {string}
 */
export function getKeyName(changing) {
  return changing.key;
}

/**
 * Возвращает добавленное,удаленное, неизменившееся значение,
 * либо пару [старое, новое] в виде массива.
 * @param {Changing} changing
 * @returns {string|Array<string>}
 */
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

/**
 * Возвращает встроенный список изменений
 * @param {Changing} changing
 * @returns {ChangingList}
 */
export function getInnerChangings(changing) {
  return changing.child;
}
