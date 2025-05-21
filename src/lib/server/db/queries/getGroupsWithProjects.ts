import { db, roomMembership, project, room, user } from '$lib/server/db';
import { and, eq, or, sql } from 'drizzle-orm';
import { projectRoom } from './common';

const userGroupsAndProjectsQuery = () =>
	db()
		.select({
			groupId: room.id,
			groupName: room.name,
			isOwner: or(
				eq(room.ownerId, sql.placeholder('userId')),
				eq(projectRoom.ownerId, sql.placeholder('userId'))
			),
			projectId: project.id,
			projectOwnerFirstName: user.firstname,
			projectOwnerLastName: user.lastname,
			projectOwnerStudentNumber: user.login,
			projectNameEN: projectRoom.name,
			projectNamePL: project.namePl
		})
		.from(roomMembership)
		.innerJoin(
			room,
			and(eq(roomMembership.roomId, room.id), eq(room.kind, 'group'))
		)
		.leftJoin(project, eq(project.groupId, room.id))
		.leftJoin(projectRoom, eq(project.id, projectRoom.id))
		.leftJoin(user, eq(user.id, projectRoom.ownerId))
		.where(eq(roomMembership.userId, sql.placeholder('userId')))
		.orderBy(room.id)
		.prepare('userGroupsAndProjectsQuery');

export type GroupWithProjects = {
	id: number;
	name: string;
	projects: {
		id: number;
		name: { en: string; pl: string };
		owner: {
			firstname: string;
			lastname: string;
			studentNumber: string;
		};
	}[];
};

export const getUserGroupsAndProjects = async (userId: number) => {
	const results = await userGroupsAndProjectsQuery().execute({ userId });
	const groups: Record<number, GroupWithProjects> = {};

	for (const {
		groupId,
		groupName,
		isOwner,
		projectId: id,
		projectNameEN,
		projectNamePL,
		projectOwnerFirstName: firstname,
		projectOwnerLastName: lastname,
		projectOwnerStudentNumber: studentNumber
	} of results) {
		const group = (groups[groupId] ||= {
			id: groupId,
			name: groupName,
			projects: []
		});

		if (id && isOwner) {
			group.projects.push({
				id,
				name: {
					en: projectNameEN!,
					pl: projectNamePL!
				},
				owner: { firstname, lastname, studentNumber }
			});
		}
	}

	return Object.values(groups);
};
