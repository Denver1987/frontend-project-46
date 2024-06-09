import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import gendiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getFilePath(filename) {
  return join(__dirname, '..', '__fixtures__', filename);
}

const testFilePath1jsonComp = getFilePath('jsonComplex/file1.json');

const testChangingPath1jsonComp = getFilePath('jsonComplex/changing1.json');

const testResultPath1jsonComp = getFilePath('jsonComplex/result1.txt');

const testResult1jsonComp = readFileSync(testResultPath1jsonComp, 'utf-8');

test('testJsonComplexStylish', () => {
  expect(gendiff(testFilePath1jsonComp, testChangingPath1jsonComp, 'stylish')).toBe(testResult1jsonComp);
});

const testFilePath1yamlComp = getFilePath('yamlComplex/file1.yml');

const testChangingPath1yamlComp = getFilePath('yamlComplex/changing1.yml');

const testResultPath1yamlComp = getFilePath('yamlComplex/result1.txt');

const testResult1yamlComp = readFileSync(testResultPath1yamlComp, 'utf-8');

test('testYamlComplexStylish', () => {
  expect(gendiff(testFilePath1yamlComp, testChangingPath1yamlComp, 'stylish')).toBe(testResult1yamlComp);
});

const testResult1JsonPlainPath = getFilePath('/jsonComplex/result1Plain.txt');

const testResult1JsonPlain = readFileSync(testResult1JsonPlainPath, 'utf-8');

test('testJsonComplexPlain', () => {
  expect(gendiff(testFilePath1jsonComp, testChangingPath1jsonComp, 'plain')).toBe(testResult1JsonPlain);
});
