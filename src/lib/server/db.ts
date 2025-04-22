import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle(DATABASE_URL);

export * from './schema';
