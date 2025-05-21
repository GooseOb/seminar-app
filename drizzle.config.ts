import type { Config } from 'drizzle-kit';

export default {
	out: './drizzle',
	schema: './src/lib/server/db/schema.ts',
	dialect: 'postgresql',
	casing: 'snake_case',
	dbCredentials: {
		url: process.env.DATABASE_URL as string
	}
} satisfies Config;
