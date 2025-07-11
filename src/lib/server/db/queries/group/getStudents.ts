import { db, roomMembership, user } from '$lib/server/db';
import { sql, eq, and, exists } from 'drizzle-orm';
import { getStudentCreatedBySubQuery } from '../student/isCreatedBy';

export const studentsInGroupQuery = () =>
	db()
		.select({
			id: user.id,
			firstname: user.firstname,
			lastname: user.lastname,
			login: user.login,
			hasPhoto: user.hasPhoto,
			canEdit: exists(getStudentCreatedBySubQuery(user.id))
		})
		.from(roomMembership)
		.where(
			and(
				eq(roomMembership.roomId, sql.placeholder('groupId')),
				eq(user.role, 'student')
			)
		)
		.innerJoin(user, eq(roomMembership.userId, user.id));

export const getStudentsInGroup = async (
	groupId: number,
	lecturerId: number
) => {
	return await studentsInGroupQuery().execute({
		groupId,
		lecturerId
	});
};
