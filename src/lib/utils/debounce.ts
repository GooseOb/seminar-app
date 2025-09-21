export const debounce = <TArgs extends any[]>(
	fn: (...args: TArgs) => any,
	ms: number
) => {
	let timeout: NodeJS.Timeout;

	return (...args: TArgs) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), ms);
	};
};
