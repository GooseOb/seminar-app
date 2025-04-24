import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_URL } from '$env/static/private';

export const db = drizzle(DATABASE_URL);

// export const db = drizzle(process.env.DATABASE_URL!);

export * from './schema';
