import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import gendiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getFilePath(filename) {
  return join(__dirname, '..', '__fixtures__', filename);
}

const testFilePath1 = getFilePath('file1.json');
const testChengingPath1 = getFilePath('changing1.json');
const testResultPath1 = getFilePath('result1.txt');

const testFile1 = readFileSync(testFilePath1, 'utf8');
const testChenging1 = readFileSync(testChengingPath1, 'utf8');
const testResult1 = readFileSync(testResultPath1, 'utf8');

test('test1', () => {
  expect(gendiff(testFilePath1, testChengingPath1)).toBe(testResult1);
});
