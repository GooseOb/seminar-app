import { getApplyRanges } from '$lib/ranges';
import { diffStrings } from './diffStrings';

const createTextNode = (text: string) => document.createTextNode(text);

const applyRanges = getApplyRanges((text, i) => {
	const el = document.createElement('span');
	el.dataset.prev = i.toString();
	el.textContent = text;
	return el;
}, createTextNode);

export const diff = (curr: string[], prev: string[]) => {
	const text = curr.join('');

	return applyRanges(text, curr, diffStrings(text, prev.join('')));
};
