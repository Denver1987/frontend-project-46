import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import gendiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getFilePath(filename) {
  return join(__dirname, '..', '__fixtures__', filename);
}

const testFilePath1json = getFilePath('file1.json');

const testChangingPath1json = getFilePath('changing1.json');

const testResultPath1json = getFilePath('result1json.txt');

const testResult1json = readFileSync(testResultPath1json, 'utf8');

test('test1', () => {
  expect(gendiff(testFilePath1json, testChangingPath1json)).toBe(testResult1json);
});

const testFilePath1yaml = getFilePath('file1.yml');

const testChangingPath1yaml = getFilePath('changing1.yml');

const testResultPath1yaml = getFilePath('result1yaml.txt');

const testResult1yaml = readFileSync(testResultPath1yaml, 'utf-8');

test('testYaml', () => {
  expect(gendiff(testFilePath1yaml, testChangingPath1yaml)).toBe(testResult1yaml);
});
