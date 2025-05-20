import { db, groupMembership } from '$lib/server/db';

export const insertGroupMembers = async (
	groupId: number,
	studentIds: number[]
) => {
	await db()
		.insert(groupMembership)
		.values(
			studentIds.map((studentId) => ({
				userId: studentId,
				groupId
			}))
		);
};
