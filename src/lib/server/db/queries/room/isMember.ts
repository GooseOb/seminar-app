import { db, roomMembership } from '$lib/server/db';
import { sql, eq, and } from 'drizzle-orm';

const membershipQuery = () =>
	db()
		.select({})
		.from(roomMembership)
		.where(
			and(
				eq(roomMembership.userId, sql.placeholder('userId')),
				eq(roomMembership.roomId, sql.placeholder('roomId'))
			)
		)
		.limit(1)
		.prepare('membershipQuery');

export const isRoomMember = (
	userId: number,
	roomId: number
): Promise<boolean> =>
	membershipQuery()
		.execute({
			userId,
			roomId
		})
		.then(({ length }) => length > 0);
