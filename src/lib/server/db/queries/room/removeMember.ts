import { db, roomMembership } from '$lib/server/db';
import { eq, and, sql } from 'drizzle-orm';

const removeMemberFromRoomQuery = () =>
	db()
		.delete(roomMembership)
		.where(
			and(
				eq(roomMembership.userId, sql.placeholder('studentId')),
				eq(roomMembership.roomId, sql.placeholder('groupId'))
			)
		)
		.prepare('removeStudentFromGroupQuery');

export const removeMemberFromRoom = async (
	studentId: number,
	groupId: number
) => {
	await removeMemberFromRoomQuery().execute({
		studentId,
		groupId
	});
};
