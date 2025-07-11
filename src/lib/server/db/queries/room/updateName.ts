import { db, room } from '$lib/server/db';
import { sql, eq } from 'drizzle-orm';

export const updateRoomNameQuery = () =>
	db()
		.update(room)
		.set({
			name: sql.placeholder('name') as any
		})
		.where(eq(room.id, sql.placeholder('id')));

export const updateRoomName = async (id: number, name: string) => {
	await updateRoomNameQuery().execute({
		id,
		name
	});
};
