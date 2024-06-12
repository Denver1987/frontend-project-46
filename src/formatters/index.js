import formJson from './json.js';
import formPlain from './plain.js';
import formStylish from './stylish.js';

export default function printDifference(changings, format) {
  if (format === 'stylish') return formStylish(changings);
  if (format === 'plain') return formPlain(changings);
  if (format === 'json') return formJson(changings);
  throw new Error('Unexpected output format');
}
