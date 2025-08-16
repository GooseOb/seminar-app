import { getApplyRanges } from '$lib/ranges';
import { createTextNode } from '../common';
import { diffStrings } from './diffStrings';

const applyRanges = getApplyRanges((text, i, ranges) => {
	const el = document.createElement('span');
	el.className = ranges[i].data ? 'diffItem' : 'diffItem new';
	el.dataset.index = i.toString();
	el.textContent = text;
	return el;
}, createTextNode);

export const diff = (curr: string[], prev: string[]) => {
	const text = curr.join('\n');
	const ranges = diffStrings(text, prev.join('\n'));

	let acc = 0;
	const currLengths = curr.map(({ length }) => {
		acc += length + 1; // +1 for space
		return acc;
	});

	let lineIndex = 0;
	for (const range of ranges) {
		while (range.fromIndex >= currLengths[lineIndex]) {
			++lineIndex;
		}
		range.fromIndex -= lineIndex;

		while (range.toIndex >= currLengths[lineIndex]) {
			++lineIndex;
		}
		range.toIndex -= lineIndex;
	}

	return {
		result: applyRanges(curr, ranges, curr.join('')),
		content: ranges.map(({ data }) => data)
	};
};
