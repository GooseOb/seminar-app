import { getApplyRanges, type RangeData } from '$lib/ranges';
import { createTextNode } from '../common';

export interface CommentData extends RangeData {
	isNew?: boolean;
}

const applyRanges = getApplyRanges((text, i, ranges: CommentData[]) => {
	const el = document.createElement('span');
	el.dataset.index = i.toString();
	el.className = 'commentItem';
	el.textContent = text;
	if (ranges[i].isNew) {
		el.id = 'newComment';
	}
	return el;
}, createTextNode);

export const withComments = applyRanges;
