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
	let timerFlag: null | number = null;
	return (...args: TArgs) => {
		if (timerFlag === null) {
			timerFlag = window.setTimeout(() => {
				fn(...args);
				timerFlag = null;
			}, ms);
		}
	};
};
