type DiffResult = {
	fromIndex: number;
	toIndex: number;
	prevContent: string;
};

export const diffStrings = (curr: string, prev: string): DiffResult[] => {
	const result: DiffResult[] = [];
	let currIndex = 0;
	let prevIndex = 0;

	while (currIndex <= curr.length || prevIndex <= prev.length) {
		// Skip matching characters
		while (
			currIndex < curr.length &&
			prevIndex < prev.length &&
			curr[currIndex] === prev[prevIndex]
		) {
			currIndex++;
			prevIndex++;
		}

		// If both strings are exhausted, we're done
		if (currIndex >= curr.length && prevIndex >= prev.length) {
			break;
		}

		// Mark the start of a difference
		const changeFromIndex = currIndex;
		const changePrevStartIndex = prevIndex;

		// Handle end-of-string cases
		if (currIndex >= curr.length) {
			// curr is shorter - remaining prev content was deleted
			result.push({
				fromIndex: changeFromIndex,
				toIndex: changeFromIndex,
				prevContent: prev.slice(changePrevStartIndex)
			});
			break;
		}

		if (prevIndex >= prev.length) {
			// prev is shorter - remaining curr content was inserted
			result.push({
				fromIndex: changeFromIndex,
				toIndex: curr.length,
				prevContent: ''
			});
			break;
		}

		// Find the next matching point or end of strings
		let bestCurrEnd = curr.length;
		let bestPrevEnd = prev.length;
		let found = false;

		// Look for a point where strings sync up again
		for (let i = currIndex + 1; i <= curr.length && !found; i++) {
			for (let j = prevIndex + 1; j <= prev.length && !found; j++) {
				// Check if we have a match from position i in curr and j in prev
				if (i < curr.length && j < prev.length && curr[i] === prev[j]) {
					// Verify it's a good sync point by checking a few characters ahead
					let matchCount = 0;
					while (
						i + matchCount < curr.length &&
						j + matchCount < prev.length &&
						curr[i + matchCount] === prev[j + matchCount] &&
						matchCount < 3
					) {
						matchCount++;
					}

					if (matchCount >= 1) {
						bestCurrEnd = i;
						bestPrevEnd = j;
						found = true;
					}
				}
			}
		}

		// Record the difference
		result.push({
			fromIndex: changeFromIndex,
			toIndex: bestCurrEnd,
			prevContent: prev.slice(changePrevStartIndex, bestPrevEnd)
		});

		// Move to the sync point
		currIndex = bestCurrEnd;
		prevIndex = bestPrevEnd;
	}

	return result;
};
