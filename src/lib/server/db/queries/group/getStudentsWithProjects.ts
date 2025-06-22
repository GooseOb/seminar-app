import { db, roomMembership, project, room, user } from '$lib/server/db';
import { eq, and, sql, exists } from 'drizzle-orm';

const groupMembersWithProjectsQuery = () =>
	db()
		.select({
			id: user.id,
			firstname: user.firstname,
			lastname: user.lastname,
			login: user.login,
			hasPhoto: user.hasPhoto,
			projectId: room.id,
			projectNameEN: room.name,
			projectNamePl: project.namePl
		})
		.from(roomMembership)
		.innerJoin(
			user,
			and(eq(roomMembership.userId, user.id), eq(user.role, 'student'))
		)
		.leftJoin(
			room,
			and(
				eq(room.ownerId, user.id),
				eq(room.kind, 'project'),
				exists(
					db()
						.select()
						.from(project)
						.where(
							and(
								eq(project.id, room.id),
								eq(project.groupId, sql.placeholder('groupId'))
							)
						)
				)
			)
		)
		.leftJoin(project, eq(project.id, room.id))
		.where(eq(roomMembership.roomId, sql.placeholder('groupId')))
		.prepare('groupMembersWithProjectsQuery');

export const getStudentsWithProjectsInGroup = async (groupId: number) => {
	return await groupMembersWithProjectsQuery().execute({
		groupId
	});
};
