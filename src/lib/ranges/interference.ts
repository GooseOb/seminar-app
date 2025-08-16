import type { RangeData } from '.';

/*
 *  @param ranges should be sorted
 */
export const isInterfering = (
	ranges: RangeData[],
	range: RangeData
): boolean => {
	let left = 0;
	let right = ranges.length - 1;
	while (left <= right) {
		const mid = Math.floor((left + right) / 2);
		const midRange = ranges[mid];

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
