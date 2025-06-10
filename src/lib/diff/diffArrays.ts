import { diffStrings } from './diffStrings';

export const createDiff =
	<T, U>(
		wrap: (text: string, i: number) => T,
		wrapUnchanged: (text: string) => U
	) =>
	(
		curr: string[],
		prev: string[]
	): { result: (T | U)[][]; content: string[] } => {
		const currText = curr.join('');
		const prevText = prev.join('');

		const arr = diffStrings(currText, prevText);

		const result: (T | U)[][] = [];

		let textIndex = 0;
		let currItem: (T | U)[] = [];
		let currItemLength = 0;
		let length = curr[0]!.length;
		for (let i = 0; i < arr.length && textIndex < curr.length; i++) {
			const diffItem = arr[i]!;
			let oldLength = length - curr[textIndex]!.length;
			if (currItem && diffItem.fromIndex >= length) {
				currItem.push(
					wrapUnchanged(currText.slice(oldLength + currItemLength, length))
				);
				result.push(currItem);
				currItem = [];
				currItemLength = 0;
				++textIndex;
				length += curr[textIndex]!.length;
			}
			while (diffItem.fromIndex >= length) {
				result.push([wrapUnchanged(curr[textIndex]!)]);
				++textIndex;
				length += curr[textIndex]!.length;
			}
			oldLength = length - curr[textIndex]!.length;
			if (diffItem.toIndex <= length) {
				currItem.push(
					wrapUnchanged(
						currText.slice(oldLength + currItemLength, diffItem.fromIndex)
					),
					wrap(currText.slice(diffItem.fromIndex, diffItem.toIndex), i)
				);
				currItemLength = diffItem.toIndex - oldLength;
			} else {
				currItem.push(
					wrapUnchanged(
						currText.slice(oldLength + currItemLength, diffItem.fromIndex)
					),
					wrap(currText.slice(diffItem.fromIndex, length), i)
				);
				result.push(currItem);
				currItem = [];
				currItemLength = 0;
				oldLength = length;
				++textIndex;
				length += curr[textIndex]!.length;
				while (diffItem.toIndex > length) {
					result.push([wrap(currText[textIndex]!, i)]);
					oldLength = length;
					++textIndex;
					length += curr[textIndex]!.length;
				}
				currItem = [wrap(currText.slice(oldLength, diffItem.toIndex), i)];
				currItemLength = diffItem.toIndex - oldLength;
			}
		}

		while (textIndex < curr.length) {
			result.push([wrapUnchanged(curr[textIndex]!)]);
			++textIndex;
		}

		return { result, content: arr.map((item) => item.prevContent) };
	};
