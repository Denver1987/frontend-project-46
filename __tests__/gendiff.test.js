import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { expect } from '@jest/globals';
import gendiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getFilePath(filename) {
  return join(__dirname, '..', '__fixtures__', filename);
}

const testFilePath1 = getFilePath('jsonComplex/file1.json');

const testChangedPath1 = getFilePath('jsonComplex/changing1.json');

const testResultPath1 = getFilePath('jsonComplex/result1.txt');

const testResult1 = readFileSync(testResultPath1, 'utf-8');

test('testJsonComplexStylish', () => {
  expect(gendiff(testFilePath1, testChangedPath1, 'stylish')).toBe(testResult1);
});

const testFilePath2 = getFilePath('yamlComplex/file1.yml');

const testChangedPath2 = getFilePath('yamlComplex/changing1.yaml');

const testResultPath2 = getFilePath('yamlComplex/result1.txt');

const testResult2 = readFileSync(testResultPath2, 'utf-8');

test('testYamlComplexStylish', () => {
  expect(gendiff(testFilePath2, testChangedPath2, 'stylish')).toBe(testResult2);
});

const testResultPath3 = getFilePath('/jsonComplex/result1Plain.txt');

const testResult3 = readFileSync(testResultPath3, 'utf-8');

test('testJsonComplexPlain', () => {
  expect(gendiff(testFilePath1, testChangedPath1, 'plain')).toBe(testResult3);
});

const testResultPath4 = getFilePath('/yamlComplex/result1Plain.txt');

const testResult4 = readFileSync(testResultPath4, 'utf-8');

test('testYamlComplexPlain', () => {
  expect(gendiff(testFilePath2, testChangedPath2, 'plain')).toBe(testResult4);
});

function isJSON(str) {
  try {
    const result = JSON.parse(str);
    return (result && typeof result === 'object' && result !== null);
  } catch (e) {
    return false;
  }
}

test('testJsonComplexJson', () => {
  const diff = gendiff(testFilePath1, testChangedPath1, 'json');
  expect(isJSON(diff)).toBe(true);
});

test('testJsonComplexYaml', () => {
  const diff = gendiff(testFilePath2, testChangedPath2, 'json');
  expect(isJSON(diff)).toBe(true);
});
