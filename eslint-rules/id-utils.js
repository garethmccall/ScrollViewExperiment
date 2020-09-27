'use strict';

function letMeFixId(value) {
	const dashFixed = value.replace('-', '_');
	const splitted = dashFixed.split(/(?=[A-Z])/).join('_');
	const deduplicated = splitted.replace('__', '_');
	return deduplicated.toLowerCase();
}

// this is regexp that all testID are validated against
// basically it allows ids in format small_letters_and_numb3rs_connected_with_underscore
// (it could be passed as param from eslint config, but due to autofix function -> it does not make sense to keep it there)
const TEST_ID_PATTERN = '^([a-z0-9]+_)*([a-z0-9]+)$';

module.exports = {
	letMeFixId,
	TEST_ID_PATTERN,
};
