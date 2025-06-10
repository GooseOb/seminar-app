export type RangeData = {
	fromIndex: number;
	toIndex: number;
	data: string;
};

export const getApplyRanges =
	<T, U>(
		wrapRange: (text: string, i: number) => T,
		wrapOutsideRange: (text: string) => U
	) =>
	(
		text: string,
		arr: string[],
		ranges: RangeData[]
	): { result: (T | U)[][]; content: string[] } => {
		const result: (T | U)[][] = [];

		let textIndex = 0;
		let currItem: (T | U)[] = [];
		let currItemLength = 0;
		let length = arr[0]!.length;
		for (let i = 0; i < ranges.length && textIndex < arr.length; i++) {
			const range = ranges[i]!;
			let oldLength = length - arr[textIndex]!.length;
			if (currItem && range.fromIndex >= length) {
				currItem.push(
					wrapOutsideRange(text.slice(oldLength + currItemLength, length))
				);
				result.push(currItem);
				currItem = [];
				currItemLength = 0;
				++textIndex;
				length += arr[textIndex]!.length;
			}
			while (range.fromIndex >= length) {
				result.push([wrapOutsideRange(arr[textIndex]!)]);
				++textIndex;
				length += arr[textIndex]!.length;
			}
			oldLength = length - arr[textIndex]!.length;
			if (range.toIndex <= length) {
				currItem.push(
					wrapOutsideRange(
						text.slice(oldLength + currItemLength, range.fromIndex)
					),
					wrapRange(text.slice(range.fromIndex, range.toIndex), i)
				);
				currItemLength = range.toIndex - oldLength;
			} else {
				currItem.push(
					wrapOutsideRange(
						text.slice(oldLength + currItemLength, range.fromIndex)
					),
					wrapRange(text.slice(range.fromIndex, length), i)
				);
				result.push(currItem);
				currItem = [];
				currItemLength = 0;
				oldLength = length;
				++textIndex;
				length += arr[textIndex]!.length;
				while (range.toIndex > length) {
					result.push([wrapRange(text[textIndex]!, i)]);
					oldLength = length;
					++textIndex;
					length += arr[textIndex]!.length;
				}
				currItem = [wrapRange(text.slice(oldLength, range.toIndex), i)];
				currItemLength = range.toIndex - oldLength;
			}
		}

		while (textIndex < arr.length) {
			result.push([wrapOutsideRange(arr[textIndex]!)]);
			++textIndex;
		}

		return { result, content: ranges.map((item) => item.data) };
	};
