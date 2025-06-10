export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const trace = <T>(arg: T) => (console.log(arg), arg);
