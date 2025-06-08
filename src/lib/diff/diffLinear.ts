type DiffResult = {
	fromIndex: number;
	toIndex: number;
	prevContent: string;
};

export function diffStringsLinear(curr: string, prev: string): DiffResult[] {
	const result: DiffResult[] = [];
	let currIndex = 0;
	let prevIndex = 0;

	while (currIndex < curr.length || prevIndex < prev.length) {
		// Skip matching prefix
		const matchStart = currIndex;
		while (
			currIndex < curr.length &&
			prevIndex < prev.length &&
			curr[currIndex] === prev[prevIndex]
		) {
			currIndex++;
			prevIndex++;
		}

		if (currIndex >= curr.length && prevIndex >= prev.length) {
			break;
		}

		// Find the longest common suffix after this point
		let currEnd = curr.length;
		let prevEnd = prev.length;

		while (
			currEnd > currIndex &&
			prevEnd > prevIndex &&
			curr[currEnd - 1] === prev[prevEnd - 1]
		) {
			currEnd--;
			prevEnd--;
		}

		// Record the difference
		if (currIndex < currEnd || prevIndex < prevEnd) {
			result.push({
				fromIndex: currIndex,
				toIndex: currEnd,
				prevContent: prev.slice(prevIndex, prevEnd)
			});
		}

		currIndex = currEnd;
		prevIndex = prevEnd;
	}

	return result;
}
