// import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/node-postgres';

export const { DATABASE_URL } = process.env.DATABASE_URL
	? process.env
	: await import('$env/static/private');

// const sql = neon(DATABASE_URL!);

export const db = () =>
	drizzle({
		connection: DATABASE_URL!,
		casing: 'snake_case'
	});

export * from './schema';
