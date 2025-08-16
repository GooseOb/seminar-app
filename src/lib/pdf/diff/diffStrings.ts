import type { RangeData } from '$lib/ranges';
import { diffWords } from 'diff';

export const diffStrings = (curr: string, prev: string): RangeData[] => {
	const changes = diffWords(prev, curr);
	const result: RangeData[] = [];
	let currIndex = 0;
	let i = 0;

	while (i < changes.length) {
		const change = changes[i];

		if (change.removed && i + 1 < changes.length && changes[i + 1].added) {
			// replacement: DELETE followed by INSERT
			const nextChange = changes[i + 1];
			result.push({
				fromIndex: currIndex,
				toIndex: currIndex + nextChange.value.length,
				data: change.value.trim() // Previous text that was replaced
			});
			currIndex += nextChange.value.length;
			i += 2; // Skip both DELETE and INSERT
		} else if (change.added) {
			// insertion
			result.push({
				fromIndex: currIndex,
				toIndex: currIndex + change.value.length,
				data: ''
			});
			currIndex += change.value.length;
			i++;
		} else if (change.removed) {
			// deletion
			result.push({
				fromIndex: currIndex,
				toIndex: currIndex,
				data: change.value.trim()
			});
			i++;
		} else {
			// equal
			currIndex += change.value.length;
			i++;
		}
	}

	return result;
};
