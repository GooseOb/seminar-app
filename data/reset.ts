import { db } from '../src/lib/server/db';
import * as schema from '../src/lib/server/schema';
import { reset } from 'drizzle-seed';

await reset(db, schema);
