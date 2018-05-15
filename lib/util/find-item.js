'use strict';

module.exports = function findItem(array, value) {
	return array.find(item => {
		if (typeof item.value === 'function') {
			return item.value({}) === value;
		}
		return item.value === value;
	});
};
