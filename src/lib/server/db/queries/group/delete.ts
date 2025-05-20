import { db, group, groupMembership } from '$lib/server/db';
import { eq, sql } from 'drizzle-orm';

const deleteGroupMembershipsQuery = () =>
	db()
		.delete(groupMembership)
		.where(eq(groupMembership.groupId, sql.placeholder('groupId')))
		.prepare('deleteGroupMembershipQuery');

const deleteGroupQuery = () =>
	db()
		.delete(group)
		.where(eq(group.id, sql.placeholder('groupId')))
		.prepare('deleteGroupQuery');

export const deleteGroup = async (groupId: number) => {
	await deleteGroupMembershipsQuery().execute({
		groupId
	});
	await deleteGroupQuery().execute({
		groupId
	});
};
