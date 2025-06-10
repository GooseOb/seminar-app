import { getApplyRanges, type RangeData } from '$lib/ranges';
import { createTextNode } from '../common';

const applyRanges = getApplyRanges((text, i) => {
	const el = document.createElement('span');
	el.dataset.index = i.toString();
	el.textContent = text;
	return el;
}, createTextNode);

export const withComments = (textArr: string[], comments: RangeData[]) =>
	applyRanges(textArr, comments, textArr.join(''));
