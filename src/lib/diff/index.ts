import { createDiff } from './diffArrays';

export const diff = createDiff(
	(text, i) => `<span data-prev="${i}">${text}</span>`
);
