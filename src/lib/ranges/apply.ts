import type { RangeData } from '.';

export const getApplyRanges =
	<TRange, TNoRange, TRangeData extends RangeData>(
		wrapRange: (text: string, index: number, ranges: TRangeData[]) => TRange,
		wrapNoRange: (text: string) => TNoRange
	) =>
	(
		chunks: string[],
		ranges: TRangeData[],
		text: string
	): (TRange | TNoRange)[][] => {
		const result: (TRange | TNoRange)[][] = [];

		let chunkIndex = 0;
		let currItem: (TRange | TNoRange)[] = [];
		let currItemLength = 0;
		let length = chunks[0]!.length;
		for (let i = 0; i < ranges.length && chunkIndex < chunks.length; i++) {
			const range = ranges[i]!;
			let itemStartIndex = length - chunks[chunkIndex]!.length;
			if (currItemLength && range.fromIndex >= length) {
				currItem.push(
					wrapNoRange(text.slice(itemStartIndex + currItemLength, length))
				);
				result.push(currItem);
				++chunkIndex;
				length += chunks[chunkIndex]!.length;
				currItem = [];
				currItemLength = 0;
			}
			while (range.fromIndex >= length) {
				result.push([wrapNoRange(chunks[chunkIndex]!)]);
				++chunkIndex;
				length += chunks[chunkIndex]!.length;
			}
			itemStartIndex = length - chunks[chunkIndex]!.length;
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
				++chunkIndex;
				length += chunks[chunkIndex]!.length;
				while (range.toIndex > length) {
					result.push([wrapRange(chunks[chunkIndex]!, i, ranges)]);
					++chunkIndex;
					length += chunks[chunkIndex]!.length;
				}
				itemStartIndex = length - chunks[chunkIndex]!.length;
				currItem = [
					wrapRange(text.slice(itemStartIndex, range.toIndex), i, ranges)
				];
				currItemLength = range.toIndex - itemStartIndex;
			}
		}
		if (currItemLength) {
			currItem.push(
				wrapNoRange(
					text.slice(
						length - chunks[chunkIndex]!.length + currItemLength,
						length
					)
				)
			);
			result.push(currItem);
			++chunkIndex;
		}

		while (chunkIndex < chunks.length) {
			result.push([wrapNoRange(chunks[chunkIndex]!)]);
			++chunkIndex;
		}

		return result;
	};
