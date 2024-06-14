export function isObject(variable) {
  return Object.prototype.toString.call(variable) === '[object Object]';
}

export function isArray(variable) {
  return Object.prototype.toString.call(variable) === '[object Array]';
}
