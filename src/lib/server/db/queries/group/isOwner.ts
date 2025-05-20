import { db, room } from '$lib/server/db';
import { sql, eq, and } from 'drizzle-orm';

const isOwnerOfRoomQuery = () =>
	db()
		.select({})
		.from(room)
		.where(
			and(
				eq(room.id, sql.placeholder('roomId')),
				eq(room.ownerId, sql.placeholder('userId'))
			)
		)
		.limit(1)
		.prepare('isOwnerOfRoomQuery');

export const isOwnerOfRoom = (
	userId: number,
	roomId: number
): Promise<boolean> =>
	isOwnerOfRoomQuery()
		.execute({
			userId,
			roomId
		})
		.then(({ length }) => length > 0);
