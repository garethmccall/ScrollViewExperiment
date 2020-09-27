module.exports = {
	create: context => ({
		MemberExpression: function(node) {
			if (
				node.object.name === 'StyleSheet' &&
				node.property.name === 'flatten'
			) {
				context.report(
					node,
					'You likely wanted to call StyleSheet.create instead of StyleSheet.flatten.',
				);
			}
		},
	}),
};
