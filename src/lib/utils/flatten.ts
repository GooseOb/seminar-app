export const flatten = <T extends any[]>(arr: T[]) => ({
	value: arr.flat() as T,
	unflatten: <U extends any[]>(value: U) => {
		let index = 0;

		return arr.map(({ length }) => value.slice(index, (index += length)) as U);
	}
});
