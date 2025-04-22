import type { Config } from 'drizzle-kit';

export default {
	out: './drizzle',
	schema: './src/lib/server/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL as string
	}
} satisfies Config;
