install:
	npm ci

gendiff:
	node bin/gendiff.js

lint:
	npx eslint .

publish:
	npm publish --dry-run

test:
	npm run test

test-coverage:
	npm test -- --coverage --coverageProvider=v8