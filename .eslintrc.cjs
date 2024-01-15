module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'simple-import-sort', 'graphql'],
	extends: [
		'next/core-web-vitals',
		'plugin:@tanstack/eslint-plugin-query/recommended',
		'airbnb',
		'airbnb/hooks',
		'airbnb-typescript',
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'prettier',
	],
	overrides: [
		{
			files: ['*.graphql'],
			parser: '@graphql-eslint/eslint-plugin',
			plugins: ['@graphql-eslint'],
			rules: {
				'@graphql-eslint/known-type-names': 'error',
			},
		},
		{
			files: ['*.ts', '*.tsx'], // Your TypeScript files extension

			// As mentioned in the comments, you should extend TypeScript plugins here,
			// instead of extending them outside the `overrides`.
			// If you don't want to extend any rules, you don't need an `extends` attribute.
			extends: [
				'plugin:@typescript-eslint/recommended',
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
			],

			parserOptions: {
				project: ['./tsconfig.json'], // Specify it only for TypeScript files
			},
		},
	],
	rules: {
		'@typescript-eslint/no-misused-promises': [
			2,
			{
				checksVoidReturn: {
					attributes: false,
				},
			},
		],
		'arrow-body-style': 'off',
		'import/prefer-default-export': 'off',
		'react/prop-types': 'off',
		'react/require-default-props': 'off',
		'react/jsx-props-no-spreading': 'off',
		'react/function-component-definition': [
			2,
			{
				namedComponents: [
					'function-declaration',
					'function-expression',
					'arrow-function',
				],
				unnamedComponents: ['function-expression', 'arrow-function'],
			},
		],
		'simple-import-sort/imports': [
			'error',
			{
				groups: [
					// Packages `react` related packages come first.
					['^react', '^@?\\w'],
					// Internal packages.
					['^(@|components)(/.*|$)'],
					// Side effect imports.
					['^\\u0000'],
					// Parent imports. Put `..` last.
					['^\\.\\.(?!/?$)', '^\\.\\./?$'],
					// Other relative imports. Put same-folder imports and `.` last.
					['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
					// Style imports.
					['^.+\\.?(css)$'],
				],
			},
		],
		'simple-import-sort/exports': 'error',
	},
}
