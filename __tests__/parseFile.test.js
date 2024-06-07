import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import parseFile from '../src/parsers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getFilePath(filename) {
  return join(__dirname, '..', '__fixtures__', filename);
}

const testFilePath = getFilePath('json/result1json.txt');
const testFile = readFileSync(testFilePath, 'utf-8');

test('minusOneRetutning', () => {
  expect(parseFile(testFile)).toBe(-1);
});
