import { db, roomMembership } from '$lib/server/db';
import { eq, sql } from 'drizzle-orm';

const deleteGroupMembershipsQuery = () =>
	db()
		.delete(roomMembership)
		.where(eq(roomMembership.roomId, sql.placeholder('groupId')))
		.prepare('deleteGroupMembershipQuery');

export const deleteGroup = async (groupId: number) => {
	await deleteGroupMembershipsQuery().execute({
		groupId
	});
};
