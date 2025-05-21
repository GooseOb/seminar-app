import { db, roomMembership } from '$lib/server/db';

export const insertRoomMembers = async (
	roomId: number,
	studentIds: number[]
) => {
	await db()
		.insert(roomMembership)
		.values(
			studentIds.map((studentId) => ({
				userId: studentId,
				roomId
			}))
		);
};
