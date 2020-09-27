const rulesDirPlugin = require('eslint-plugin-rulesdir');

rulesDirPlugin.RULES_DIR = 'eslint-rules';

module.exports = {
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier/@typescript-eslint',
		'plugin:prettier/recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript',
	],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module', // Allows for the use of imports
	},
	plugins: [
		'@typescript-eslint',
		'import',
		'jest',
		'prettier',
		'react-hooks',
		'react-native',
		'react',
		'rulesdir',
	],
	env: {
		es6: true,
		node: true,
		browser: true, // only to allow usage of FormData
		'jest/globals': true,
	},
	rules: {
		'@typescript-eslint/ban-ts-comment': [
			'error',
			{
				'ts-expect-error': 'allow-with-description',
				'ts-ignore': 'allow-with-description', // remove after MOBILE-435 is completed
			},
		],
		'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
		'@typescript-eslint/explicit-function-return-type': 0,
		'@typescript-eslint/explicit-member-accessibility': [
			2,
			{ accessibility: 'no-public' },
		],
		'@typescript-eslint/explicit-module-boundary-types': 0,
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'interface',
				format: ['PascalCase'],
				custom: {
					// prevent starting interface name with I
					regex: '^I[A-Z]',
					match: false,
				},
			},
		],
		'@typescript-eslint/no-empty-function': 0,
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-inferrable-types': 0,
		'@typescript-eslint/no-non-null-assertion': 0,
		'@typescript-eslint/no-shadow': ['error'],
		'@typescript-eslint/no-unused-expressions': [
			'error',
			{ allowShortCircuit: true, allowTernary: true },
		],
		'@typescript-eslint/no-unused-vars': [2, { ignoreRestSiblings: true }],
		'@typescript-eslint/no-use-before-define': 0,
		'arrow-body-style': 0,
		camelcase: 0,
		'class-methods-use-this': 0,
		curly: ['error', 'all'],
		'default-case': 0,
		'dot-notation': 0,
		'max-params': ['error', 4],
		'import/default': 0,
		'import/group-exports': 0,
		'import/extensions': ['error', 'never', { json: 'always', png: 'always' }],
		'import/named': 0, // investigate why?
		'import/namespace': 0,
		'import/newline-after-import': 2,
		'import/no-commonjs': 2,
		'import/no-cycle': 0, // should be restored?
		'import/no-dynamic-require': 2,
		'import/no-extraneous-dependencies': 2,
		'import/no-named-as-default': 0,
		'import/no-named-as-default-member': 0,
		'import/no-self-import': 0, // should be restored?
		'import/no-unresolved': [2, { ignore: ['.png$', '.json$'] }],
		'import/no-useless-path-segments': [
			'error',
			{
				noUselessIndex: true,
			},
		],
		'import/order': [
			2,
			{
				groups: [['builtin', 'external'], 'internal', 'parent', 'sibling'],
				alphabetize: {
					order: 'asc',
				},
			},
		],
		'jsx-a11y/accessible-emoji': 0,
		'lines-between-class-members': [
			2,
			'always',
			{ exceptAfterSingleLine: true },
		],
		'max-lines': ['error', { max: 620 }], // this should be decrease to ~500 (PayFriends screens needs to be refactored)
		'no-async-promise-executor': 0,
		'no-case-declarations': 0,
		'no-console': ['error', { allow: ['warn', 'error'] }],
		'no-duplicate-imports': 2,
		'no-else-return': 0,
		'no-fallthrough': 0,
		'no-plusplus': 0,
		'no-prototype-builtins': 2,
		'no-return-assign': 0,
		'no-shadow': 0, //enabled via @typescript-eslint/no-shadow
		'no-underscore-dangle': 0,
		'no-use-before-define': 0,
		'no-useless-escape': 2,
		'object-shorthand': ['error', 'always'],
		'prefer-destructuring': [
			2,
			{
				VariableDeclarator: {
					array: false,
					object: true,
				},
			},
		],
		'react-hooks/exhaustive-deps': 'error', // collides with "didMount" hook implementation but it's too helpful :(
		'react-hooks/rules-of-hooks': 'error',
		'react-native/no-inline-styles': 'error',
		'react-native/no-unused-styles': 2,
		'react/destructuring-assignment': 0, // this might be enabled in future, but requires a lot of code changes
		'react/forbid-prop-types': 0,
		'react/jsx-boolean-value': 2,
		'react/jsx-curly-brace-presence': [2, 'never'],
		'react/jsx-filename-extension': 0,
		'react/jsx-fragments': [2, 'element'],
		'react/no-access-state-in-setstate': 0,
		'react/no-array-index-key': 0, // rule should be restored
		'react/no-multi-comp': 0,
		'react/no-unescaped-entities': 0,
		'react/no-unsafe': ['error', { checkAliases: true }],
		'react/prefer-stateless-function': 0,
		'react/prop-types': 0,
		'react/require-default-props': 0,
		'react/sort-comp': 0,
		'react/no-unused-state': 2,
		'require-atomic-updates': 0, // rule should be restored
		'rulesdir/no-stylesheet-flatten': 2,
		'rulesdir/valid-testid-format': 2,
		'no-restricted-imports': [
			'error',
			{
				paths: [
					{
						name: 'lodash',
						message:
							'Please use module import instead of a full lodash import, e.g. lodash/debounce',
					},
				],
				// please import only from "utils/analytics". Add what you need in "utils/analytics/index.tsx"
				patterns: ['utils/analytics/**'], // TODO MOBILE-901 add message when eslint allows pattern messages
			},
		],
		// TODO: MOBILE-1000
		// below rule is temporary disabled.
		// It requires closer look to decide if we want it or not
		'@typescript-eslint/ban-types': 0,
	},
	settings: {
		'import/resolver': {
			typescript: {},
		},
		'import/external-module-folders': [
			'node_modules',
			'node_modules/@types',
			'src/@types',
		],
		react: {
			pragma: 'React',
			version: 'detect',
		},
	},
};
