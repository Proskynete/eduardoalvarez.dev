module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['simple-import-sort'],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
	env: {
		browser: true,
		amd: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:jsx-a11y/recommended',
		'prettier/@typescript-eslint',
		'plugin:prettier/recommended',
	],
	rules: {
		'prettier/prettier': ['error', {}, { usePrettierrc: true }],
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'off',
		'simple-import-sort/sort': 'error',
		'jsx-a11y/anchor-is-valid': [
			'error',
			{
				components: ['Link'],
				specialLink: ['hrefLeft', 'hrefRight'],
				aspects: ['invalidHref', 'preferButton'],
			},
		],
		'jsx-a11y/interactive-supports-focus': [
			'error',
			{
				tabbable: [
					'button',
					'checkbox',
					'link',
					'searchbox',
					'spinbutton',
					'switch',
					'textbox',
				],
			},
		],
		'@typescript-eslint/no-var-requires': 0,
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
	},
};
