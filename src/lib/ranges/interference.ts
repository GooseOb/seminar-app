import type { RangeData } from '.';

/*
 *  @param arr - sorted array of ranges
 */
export const isInterfering = (arr: RangeData[], range: RangeData): boolean => {
	let left = 0;
	let right = arr.length - 1;
	while (left <= right) {
		const mid = Math.floor((left + right) / 2);
		const midRange = arr[mid];

		if (midRange.toIndex <= range.fromIndex) {
			left = mid + 1;
		} else if (midRange.fromIndex >= range.toIndex) {
			right = mid - 1;
		} else {
			return true;
		}
	}

	return false;
};
