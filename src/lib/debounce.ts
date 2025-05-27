export const debounce = <
	TArgs extends any[],
	T extends (...args: TArgs) => any
>(
	fn: T,
	ms: number
): ((...args: TArgs) => void) => {
	let timeout: NodeJS.Timeout;

	return (...args: TArgs) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), ms);
	};
};

export const throttle = <
	TArgs extends any[],
	T extends (...args: TArgs) => any
>(
	fn: T,
	ms: number
): ((...args: TArgs) => void) => {
	let lastCall = 0;

	return (...args: TArgs) => {
		const now = Date.now();
		if (now - lastCall >= ms) {
			lastCall = now;
			fn(...args);
		}
	};
};
