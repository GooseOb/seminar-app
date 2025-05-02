import { drizzle } from 'drizzle-orm/node-postgres';

const DATABASE_URL =
	process.env.DATABASE_URL ||
	(await import('$env/static/private')).DATABASE_URL;

export const db = drizzle(DATABASE_URL);

export * from './schema';
