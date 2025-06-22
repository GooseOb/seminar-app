import { drizzle } from 'drizzle-orm/node-postgres';

let DATABASE_URL: string;

export const setDatabaseUrl = (url: string) => {
	DATABASE_URL = url;
};

const instance =
	process.env.DATABASE_URL &&
	drizzle({
		connection: process.env.DATABASE_URL,
		casing: 'snake_case'
	});

export const db = instance
	? () => instance
	: () =>
			drizzle({
				connection: DATABASE_URL,
				casing: 'snake_case'
			});

export * from './schema';
