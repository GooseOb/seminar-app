export const flatten = <T extends any[]>(
	arr: T[]
): {
	value: T;
	unflatten: (arr: T) => T[];
} => ({
	value: arr.flat() as T,
	unflatten: (value: T) => {
		let index = 0;

		return arr.map(({ length }) => value.slice(index, (index += length)) as T);
	}
});
