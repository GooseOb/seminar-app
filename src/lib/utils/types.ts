export type MaybePromise<T> = T | Promise<T>;

export type OptionalNull<T extends object> = {
	[K in keyof T as null extends T[K] ? K : never]?: T[K] | undefined;
} & {
	[K in keyof T as null extends T[K] ? never : K]: T[K];
};
