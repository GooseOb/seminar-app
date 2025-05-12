import { drizzle } from 'drizzle-orm/node-postgres';

export const { DATABASE_URL } = process.env.DATABASE_URL
	? process.env
	: await import('$env/static/private');

export const db = () =>
	drizzle({
		connection: DATABASE_URL!,
		casing: 'snake_case'
	});

export * from './schema';
