import { db } from '../src/lib/server/db';
import * as schema from '../src/lib/server/schema';
import { reset } from 'drizzle-seed';

await reset(db, schema);

process.stdout.write('Database reset complete\n');

await import('./seed');

process.exit(0);
