'use strict';

const { letMeFixId, TEST_ID_PATTERN } = require('./id-utils');

module.exports = {
	meta: {
		docs: {
			description: 'Ensures consistent usage of id value in `by.id` function',
			category: 'Best Practices',
		},
		messages: {
			invalidTestId: `'"{{value}}" should match Chime testID pattern`,
		},
		fixable: 'code',
		schema: [
			{
				type: 'object',
				default: {},
				additionalProperties: false,
			},
		],
	},

	create: context => ({
		MemberExpression: node => {
			if (node.object.name === 'by' && node.property.name === 'id') {
				const { value } = node.parent.arguments[0];
				const bigLetterRegex = new RegExp('^[A-Z]+[a-z]* '); // this is looking for word starting with big letter and then space (aka sentence)
				if (value && bigLetterRegex.test(value)) {
					// ignore IDs that starts with upper case and has space, as they are not testID
				} else {
					const regex = new RegExp(TEST_ID_PATTERN);

					if (value && !regex.test(value)) {
						context.report({
							node,
							messageId: 'invalidTestId',
							data: {
								value,
							},
							fix: fixer => {
								const maybeFixedValue = letMeFixId(value);
								return fixer.replaceText(
									node.parent.arguments[0],
									`'${maybeFixedValue}'`,
								);
							},
						});
					}
				}
			}
		},
	}),
};
