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
	const text = curr.join('');
	const ranges = diffStrings(text, prev.join(''));

	return {
		result: applyRanges(curr, ranges, text),
		content: ranges.map(({ data }) => data)
	};
};
