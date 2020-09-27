'use strict';

const { letMeFixId, TEST_ID_PATTERN } = require('./id-utils');

module.exports = {
	meta: {
		docs: {
			description: 'Ensures consistent usage of `testID` and `uniqueTestID`',
			category: 'Best Practices',
		},
		messages: {
			invalidTestId: `'{{attr}}': "{{value}}" should match Chime testID pattern`,
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

	create: context => {
		function getAttributeName(node) {
			return (
				(node.parent.name && node.parent.name.name) ||
				(node.parent.key && node.parent.key.name) ||
				'testID'
			);
		}

		function validateAttribute(node) {
			const value =
				node && node.parent && node.parent.value && node.parent.value.value;
			const regex = new RegExp(TEST_ID_PATTERN);
			if (value && !regex.test(value)) {
				const attr = getAttributeName(node);
				context.report({
					node,
					messageId: 'invalidTestId',
					data: {
						attr,
						value,
					},
					fix: function(fixer) {
						const attribute = node.parent.value;
						const maybeFixedValue = letMeFixId(value);
						return fixer.replaceText(attribute, `"${maybeFixedValue}"`);
					},
				});
			}
		}

		return {
			[`JSXIdentifier[name=testID]`]: validateAttribute,
			[`JSXIdentifier[name=/(.+)TestID/]`]: validateAttribute,
			[`Identifier[name=/(.+)TestID/]`]: node => {
				if (node.parent.value && node.parent.value.type === 'Literal') {
					validateAttribute(node);
				}
			},
			[`Identifier[name="testID"]`]: node => {
				if (node.parent.value && node.parent.value.type === 'Literal') {
					validateAttribute(node);
				}
			},
		};
	},
};
