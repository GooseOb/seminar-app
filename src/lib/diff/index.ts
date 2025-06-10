import { createDiff } from './diffArrays';

export const diff = createDiff(
	(text, i) => {
		const el = document.createElement('span');
		el.dataset.prev = i.toString();
		el.textContent = text;
		return el;
	},
	(text) => document.createTextNode(text)
);
