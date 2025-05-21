import { db, setDatabaseUrl } from '../src/lib/server/db';
import * as schema from '../src/lib/server/db/schema';
import { reset } from 'drizzle-seed';

setDatabaseUrl(process.env.DATABASE_URL!);

await reset(db(), schema);

process.stdout.write('Database reset complete\n');

await import('./seed');

process.exit(0);
