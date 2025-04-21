import { DATABASE_URL } from '$env/static/private';
import type { Config } from 'drizzle-kit';

export default {
	out: './drizzle',
	schema: './src/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: DATABASE_URL,
	},
} satisfies Config;
