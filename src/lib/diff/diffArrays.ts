import { diffStrings } from './diffStrings';

export const createDiff =
	(wrap: (text: string, i: number) => string) =>
	(curr: string[], prev: string[]): { result: string[]; content: string[] } => {
		const currText = curr.join('');
		const prevText = prev.join('');

		const arr = diffStrings(currText, prevText);

		const result: string[] = [];

		let textIndex = 0;
		let length = curr[0]!.length;
		for (let i = 0; i < arr.length; i++) {
			const diffItem = arr[i]!;
			while (diffItem.fromIndex >= length) {
				result.push(curr[textIndex]!);
				++textIndex;
				length += curr[textIndex]!.length;
			}
			let oldLength = length - curr[textIndex]!.length;
			if (diffItem.toIndex <= length) {
				result.push(
					currText.slice(oldLength, diffItem.fromIndex) +
						wrap(currText.slice(diffItem.fromIndex, diffItem.toIndex), i) +
						currText.slice(diffItem.toIndex, length)
				);
			} else {
				result.push(
					currText.slice(oldLength, diffItem.fromIndex) +
						wrap(currText.slice(diffItem.fromIndex, length), i)
				);
				oldLength = length;
				++textIndex;
				length += curr[textIndex]!.length;
				while (diffItem.toIndex > length) {
					result.push(wrap(currText[textIndex]!, i));
					oldLength = length;
					++textIndex;
					length += curr[textIndex]!.length;
				}
				result.push(
					wrap(currText.slice(oldLength, diffItem.toIndex), i) +
						currText.slice(diffItem.toIndex, length)
				);
				oldLength = length;
				++textIndex;
				if (textIndex >= curr.length) {
					break;
				}
				length += curr[textIndex]!.length;
			}
		}
		++textIndex;
		while (textIndex < curr.length) {
			result.push(curr[textIndex]!);
			++textIndex;
		}

		return { result, content: arr.map((item) => item.prevContent) };
	};
