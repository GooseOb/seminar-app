import { drizzle } from 'drizzle-orm/node-postgres';

let DATABASE_URL: string;

export const setDatabaseUrl = (url: string) => {
	DATABASE_URL = url;
};

export const db = () =>
	drizzle({
		connection: DATABASE_URL,
		casing: 'snake_case'
	});

export * from './schema';
