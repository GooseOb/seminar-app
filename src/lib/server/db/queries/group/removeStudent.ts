import { db, groupMembership } from '$lib/server/db';
import { eq, and, sql } from 'drizzle-orm';

const removeStudentFromGroupQuery = () =>
	db()
		.delete(groupMembership)
		.where(
			and(
				eq(groupMembership.userId, sql.placeholder('studentId')),
				eq(groupMembership.groupId, sql.placeholder('groupId'))
			)
		)
		.prepare('removeStudentFromGroupQuery');

export const removeStudentFromGroup = async (
	studentId: number,
	groupId: number
) => {
	await removeStudentFromGroupQuery().execute({
		studentId,
		groupId
	});
};
