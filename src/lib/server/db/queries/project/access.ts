import { db, project, room } from '$lib/server/db';
import { projectRoom } from '$lib/server/db/queries/common';
import { eq, and, or, exists, sql } from 'drizzle-orm';

const hasAccessToProjectQuery = () =>
	db()
		.select({})
		.from(projectRoom)
		.innerJoin(project, eq(project.id, projectRoom.id))
		.where(
			and(
				eq(projectRoom.id, sql.placeholder('projectId')),
				or(
					// user is owner of the project
					eq(projectRoom.ownerId, sql.placeholder('userId')),
					// user is owner of the group the project belongs to
					exists(
						db()
							.select()
							.from(room)
							.where(
								and(
									eq(room.id, project.groupId),
									eq(room.ownerId, sql.placeholder('userId'))
								)
							)
					)
				)
			)
		);

export const hasAccessToProject = (
	userId: number,
	projectId: number
): Promise<boolean> =>
	hasAccessToProjectQuery()
		.execute({
			projectId,
			userId
		})
		.then(({ length }) => length > 0);
