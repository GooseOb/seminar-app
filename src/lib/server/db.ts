import { drizzle } from 'drizzle-orm/node-postgres';

const DATABASE_URL =
	process.env.DATABASE_URL ||
	(await import('$env/static/private')).DATABASE_URL;

export const db = drizzle({
	connection: DATABASE_URL,
	casing: 'snake_case'
});

export * from './schema';
