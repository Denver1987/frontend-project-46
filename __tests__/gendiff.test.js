import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import gendiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getFilePath(filename) {
  return join(__dirname, '..', '__fixtures__', filename);
}

const testFilePath1json = getFilePath('json/file1.json');

const testChangingPath1json = getFilePath('json/changing1.json');

const testResultPath1json = getFilePath('json/result1json.txt');

const testResult1json = readFileSync(testResultPath1json, 'utf8');

test('testJson', () => {
  expect(gendiff(testFilePath1json, testChangingPath1json)).toBe(testResult1json);
});

const testFilePath1yaml = getFilePath('yaml/file1.yml');

const testChangingPath1yaml = getFilePath('yaml/changing1.yml');

const testResultPath1yaml = getFilePath('yaml/result1yaml.txt');

const testResult1yaml = readFileSync(testResultPath1yaml, 'utf-8');

test('testYaml', () => {
  expect(gendiff(testFilePath1yaml, testChangingPath1yaml)).toBe(testResult1yaml);
});

const testFilePath1jsonComp = getFilePath('jsonComplex/file1.json');

const testChangingPath1jsonComp = getFilePath('jsonComplex/changing1.json');

const testResultPath1jsonComp = getFilePath('jsonComplex/result1.txt');

const testResult1jsonComp = readFileSync(testResultPath1jsonComp, 'utf-8');

test('testJsonComplex', () => {
  expect(gendiff(testFilePath1jsonComp, testChangingPath1jsonComp)).toBe(testResult1jsonComp);
});
