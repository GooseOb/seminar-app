import { db, room } from '$lib/server/db';
import { sql } from 'drizzle-orm';

export const insertRoomQuery = () =>
	db()
		.insert(room)
		.values({
			name: sql.placeholder('name'),
			ownerId: sql.placeholder('ownerId'),
			kind: sql.placeholder('kind')
		})
		.returning();
