/**
 * Преобразует отчет в формат JSON
 * @param {ChangingList} changings список изменений
 * @returns {string}
 */
export default function formJson(changings) {
  return JSON.stringify(changings, null, ' ');
}
