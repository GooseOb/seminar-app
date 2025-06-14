import type { RangeData } from '.';

export const getRangeFromSelectionRange = (
	range: Range,
	fromIndex: number = 0
): RangeData => {
	const { startContainer, endContainer, startOffset, endOffset } = range;
	const startEl = startContainer.parentElement!;
	const endEl = endContainer.parentElement!;
	let toIndex = 0;
	let isLookingForStart = true;

	for (const child of startEl.parentElement!.children) {
		if (isLookingForStart) {
			if (child === startEl) {
				if (startEl === endEl) {
					for (const el of startEl.childNodes) {
						if (el === startContainer) {
							break;
						} else {
							fromIndex += el.textContent!.length;
						}
					}
					toIndex = fromIndex + endOffset;
					fromIndex += startOffset;
					break;
				}
				toIndex = fromIndex + child.textContent!.length;
				fromIndex += startOffset;
				isLookingForStart = false;
			} else {
				fromIndex += child.textContent!.length;
			}
		} else if (child === endEl) {
			for (const el of endEl.childNodes) {
				if (el === endContainer) {
					break;
				} else {
					toIndex += el.textContent!.length;
				}
			}
			toIndex += endOffset;
			break;
		} else {
			toIndex += child.textContent!.length;
		}
	}

	return {
		fromIndex,
		toIndex,
		data: ''
	};
};
