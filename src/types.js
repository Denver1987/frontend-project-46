/**
 * Тип изменения в двух объектах
 * @typedef {(
 * 'added'|
 * 'nested'|
 * 'changed'|
 * 'deleted'|
 * 'unchanged')} Status
*/

/**
 * Объект, описывающий изменение в двух объектах
 * @typedef Changing
 * @prop {string} key
 * @prop {Status} status
 * @prop {*} value
 */

/**
 * Список изменений
 * @typedef {Array<Changing>} ChangingList
 */
