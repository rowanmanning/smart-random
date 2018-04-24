'use strict';

const randomBetween = require('./random-between');

module.exports = function randomItemWeighted(array) {
	const max = array.reduce((total, item) => total + item.weight || 1, 0);
	let target = randomBetween(1, max);
	for (const item of array) {
		if (target <= item.weight) {
			return item;
		}
		target -= item.weight;
	}
};
