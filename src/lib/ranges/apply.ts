import type { RangeData } from '.';

export const getApplyRanges =
	<T, U, TRange extends RangeData>(
		wrapRange: (text: string, index: number, ranges: TRange[]) => T,
		wrapNoRange: (text: string) => U
	) =>
	(arr: string[], ranges: TRange[], text: string): (T | U)[][] => {
		const result: (T | U)[][] = [];

		let textIndex = 0;
		let currItem: (T | U)[] = [];
		let currItemLength = 0;
		let length = arr[0]!.length;
		for (let i = 0; i < ranges.length && textIndex < arr.length; i++) {
			const range = ranges[i]!;
			let itemStartIndex = length - arr[textIndex]!.length;
			if (currItemLength && range.fromIndex >= length) {
				currItem.push(
					wrapNoRange(text.slice(itemStartIndex + currItemLength, length))
				);
				result.push(currItem);
				++textIndex;
				length += arr[textIndex]!.length;
				currItem = [];
				currItemLength = 0;
			}
			while (range.fromIndex >= length) {
				result.push([wrapNoRange(arr[textIndex]!)]);
				++textIndex;
				length += arr[textIndex]!.length;
			}
			itemStartIndex = length - arr[textIndex]!.length;
			if (range.toIndex <= length) {
				currItem.push(
					wrapNoRange(
						text.slice(itemStartIndex + currItemLength, range.fromIndex)
					),
					wrapRange(text.slice(range.fromIndex, range.toIndex), i, ranges)
				);
				currItemLength = range.toIndex - itemStartIndex;
			} else {
				currItem.push(
					wrapNoRange(
						text.slice(itemStartIndex + currItemLength, range.fromIndex)
					),
					wrapRange(text.slice(range.fromIndex, length), i, ranges)
				);
				itemStartIndex = length;
				result.push(currItem);
				++textIndex;
				length += arr[textIndex]!.length;
				while (range.toIndex > length) {
					result.push([wrapRange(arr[textIndex]!, i, ranges)]);
					++textIndex;
					length += arr[textIndex]!.length;
				}
				itemStartIndex = length - arr[textIndex]!.length;
				currItem = [
					wrapRange(text.slice(itemStartIndex, range.toIndex), i, ranges)
				];
				currItemLength = range.toIndex - itemStartIndex;
			}
		}
		if (currItemLength) {
			currItem.push(
				wrapNoRange(
					text.slice(length - arr[textIndex]!.length + currItemLength, length)
				)
			);
			result.push(currItem);
			++textIndex;
		}

		while (textIndex < arr.length) {
			result.push([wrapNoRange(arr[textIndex]!)]);
			++textIndex;
		}

		return result;
	};
