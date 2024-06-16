import path from 'node:path';
import yaml from 'js-yaml';
import { readFileSync } from 'node:fs';

/**
 * Парсит файлы в соответствии с форматом.
 * Формат определяется в соответствии с расширением файла.
 * @param {string} filepath путь к файлу
 * @returns {*}
 */
// eslint-disable-next-line consistent-return
export default function parseFile(filepath) {
  if (path.extname(filepath) === '.json') {
    return JSON.parse(readFileSync(filepath, 'utf8'));
  }
  if (path.extname(filepath) === '.yml' || path.extname(filepath) === '.yaml') {
    return yaml.load(readFileSync(filepath, 'utf-8'));
  }
}
