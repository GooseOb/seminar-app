import { diffStringsOptimal } from './diffOptimal';

export const createDiff =
	(wrap: (text: string, i: number) => string) =>
	(curr: string[], prev: string[]): { result: string[]; content: string[] } => {
		const currText = curr.join('');
		const prevText = prev.join('');

		const arr = diffStringsOptimal(currText, prevText);

		const result: string[] = [];

		let textIndex = 0;
		let currTextItem = '';
		let currTextItemLength = 0;
		let length = curr[0]!.length;
		for (let i = 0; i < arr.length && textIndex < curr.length; i++) {
			const diffItem = arr[i]!;
			let oldLength = length - curr[textIndex]!.length;
			if (currTextItem && diffItem.fromIndex >= length) {
				result.push(
					currTextItem + currText.slice(oldLength + currTextItemLength, length)
				);
				currTextItem = '';
				currTextItemLength = 0;
				++textIndex;
				length += curr[textIndex]!.length;
			}
			while (diffItem.fromIndex >= length) {
				result.push(curr[textIndex]!);
				++textIndex;
				length += curr[textIndex]!.length;
			}
			oldLength = length - curr[textIndex]!.length;
			if (diffItem.toIndex <= length) {
				currTextItem +=
					currText.slice(oldLength + currTextItemLength, diffItem.fromIndex) +
					wrap(currText.slice(diffItem.fromIndex, diffItem.toIndex), i);
				currTextItemLength = diffItem.toIndex - oldLength;
			} else {
				result.push(
					currTextItem +
						currText.slice(oldLength + currTextItemLength, diffItem.fromIndex) +
						wrap(currText.slice(diffItem.fromIndex, length), i)
				);
				currTextItem = '';
				currTextItemLength = 0;
				oldLength = length;
				++textIndex;
				length += curr[textIndex]!.length;
				while (diffItem.toIndex > length) {
					result.push(wrap(currText[textIndex]!, i));
					oldLength = length;
					++textIndex;
					length += curr[textIndex]!.length;
				}
				currTextItem = wrap(currText.slice(oldLength, diffItem.toIndex), i);
				currTextItemLength = diffItem.toIndex - oldLength;
			}
		}
		++textIndex;
		while (textIndex < curr.length) {
			result.push(curr[textIndex]!);
			++textIndex;
		}

		// console.log(curr.length, result.length);
		// for (let i = 0; i < curr.length; i++) {
		// 	console.log({ curr: curr[i], diff: result[i] });
		// }

		return { result, content: arr.map((item) => item.prevContent) };
	};
