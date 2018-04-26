'use strict';

const randomItem = require('./util/random-item-weighted');
const isObject = require('./util/is-object');

module.exports = function smartRandom(sources) {
	return buildGenerator(sanitizeSources(sources));
};

function buildGenerator(sources) {
	return function generator(result = {tags: []}) {
		result.tags = (Array.isArray(result.tags) ? result.tags : []);
		for (const {name, items} of sources) {
			const item = randomItem(enforceFilters(items, result.tags));
			if (item) {
				result[name] = (typeof item.value === 'function' ? item.value(result) : item.value);
				result.tags = result.tags.concat(item.tags);
				if (item.add) {
					result = Object.assign(item.add, result);
				}
			} else {
				result[name] = undefined;
			}
		}
		result.tags = Array.from(new Set(result.tags));
		return result;
	};
}

function enforceFilters(items, tags) {
	return items
		.filter(filterNot(tags))
		.filter(filterOnly(tags));
}

function filterOnly(tags) {
	return item => {
		if (!item.only.length) {
			return true;
		}
		if (!tags.length) {
			return false;
		}
		for (const tag of tags) {
			if (item.only.includes(tag)) {
				return true;
			}
		}
	};
}

function filterNot(tags) {
	return item => {
		if (!item.not.length) {
			return true;
		}
		for (const tag of tags) {
			if (item.not.includes(tag)) {
				return false;
			}
		}
		return true;
	};
}

function sanitizeSources(sources) {
	if (!Array.isArray(sources)) {
		throw new TypeError('Sources must be an array');
	}
	return sources.map(source => {
		if (!isObject(source)) {
			throw new TypeError('Each source must be an object');
		}
		source = Object.assign({}, source);
		if (typeof source.name !== 'string' && typeof source.name !== 'number') {
			throw new TypeError('Source "name" property must be a string or a number');
		}
		if (!Array.isArray(source.items)) {
			throw new TypeError('Source "items" property must be an array');
		}
		source.items = source.items.map(item => {
			item = Object.assign({
				not: [],
				only: [],
				tags: [],
				weight: 1
			}, item);
			if (item.add && !isObject(item.add)) {
				throw new TypeError('Item "add" property must be an object');
			}
			if (!Array.isArray(item.not)) {
				throw new TypeError('Item "not" property must be an array');
			}
			if (!Array.isArray(item.only)) {
				throw new TypeError('Item "only" property must be an array');
			}
			if (!Array.isArray(item.tags)) {
				throw new TypeError('Item "tags" property must be an array');
			}
			return item;
		});
		return source;
	});
}
