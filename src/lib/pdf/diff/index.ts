import { getApplyRanges } from '$lib/ranges';
import { createTextNode } from '../common';
import { diffStrings } from './diffStrings';

export const diff = (curr: string[], prev: string[]) => {
	const text = curr.join('');
	const ranges = diffStrings(text, prev.join(''));

	return getApplyRanges((text, i) => {
		const el = document.createElement('span');
		el.className = ranges[i].data ? 'diffItem' : 'diffItem new';
		el.dataset.index = i.toString();
		el.textContent = text;
		return el;
	}, createTextNode)(curr, ranges, text);
};
