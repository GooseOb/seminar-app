import type { RangeData } from '$lib/ranges';

export const diffStrings = (curr: string, prev: string): RangeData[] => {
	const m = prev.length;
	const n = curr.length;

	const dp: number[][] = Array.from({ length: m + 1 }, () =>
		Array.from({ length: n + 1 }, () => 0)
	);

	// Initialize base cases
	for (let i = 0; i <= m; i++) dp[i][0] = i;
	for (let j = 0; j <= n; j++) dp[0][j] = j;

	// Fill the DP table
	for (let i = 1; i <= m; i++) {
		for (let j = 1; j <= n; j++) {
			if (prev[i - 1] === curr[j - 1]) {
				dp[i][j] = dp[i - 1][j - 1];
			} else {
				dp[i][j] =
					1 +
					Math.min(
						dp[i - 1][j], // deletion
						dp[i][j - 1], // insertion
						dp[i - 1][j - 1] // substitution
					);
			}
		}
	}

	// Backtrack to find the actual operations
	const result: RangeData[] = [];
	let i = m,
		j = n;

	while (i > 0 || j > 0) {
		// Find sequences of operations
		if (i > 0 && j > 0 && prev[i - 1] === curr[j - 1]) {
			// Characters match, move diagonally
			i--;
			j--;
		} else {
			// Found a difference - determine the range
			const endJ = j;
			const endI = i;

			// Collect consecutive operations
			while (i > 0 || j > 0) {
				if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
					// Substitution
					i--;
					j--;
				} else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
					// Deletion from prev
					i--;
				} else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
					// Insertion to curr
					j--;
				} else {
					break;
				}

				// Check if we've found a matching character (end of this diff block)
				if (i > 0 && j > 0 && prev[i - 1] === curr[j - 1]) {
					break;
				}
			}

			// Add the difference
			if (j !== endJ || i !== endI) {
				result.unshift({
					fromIndex: j,
					toIndex: endJ,
					data: prev.slice(i, endI)
				});
			}
		}
	}

	return result;
};
