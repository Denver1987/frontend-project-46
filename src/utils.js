/**
 * Проверяет, является ли переданное значение объектом
 * @param {*} variable проверяемое значение
 * @returns {boolean}
 */
export function isObject(variable) {
  return Object.prototype.toString.call(variable) === '[object Object]';
}

/**
 * Проверяет, является ли переданное значение массивом
 * @param {*} variable проверяемое значение
 * @returns {boolean}
 */
export function isArray(variable) {
  return Object.prototype.toString.call(variable) === '[object Array]';
}
