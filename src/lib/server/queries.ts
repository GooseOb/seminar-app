import { alias } from 'drizzle-orm/pg-core';
import {
	db,
	groupMembershipTable,
	groupTable,
	projectTable,
	roomTable,
	userTable
} from './db';
import { eq, and, sql } from 'drizzle-orm';

export type GroupWithProjects = {
	id: number;
	name: string;
	projects: {
		id: number;
		name: string;
	}[];
};

const projectRoomTable = alias(roomTable, 'project_room');
const userGroupsAndProjectsQuery = db
	.select({
		groupId: groupTable.id,
		groupName: roomTable.name,
		isOwner: eq(roomTable.ownerId, sql.placeholder('userId')),
		projectId: projectTable.id,
		projectName: projectRoomTable.name
	})
	.from(groupMembershipTable)
	.innerJoin(groupTable, eq(groupMembershipTable.groupId, groupTable.id))
	.innerJoin(roomTable, eq(groupTable.id, roomTable.id))
	.leftJoin(projectTable, eq(projectTable.groupId, groupTable.id))
	.leftJoin(projectRoomTable, eq(projectTable.id, projectRoomTable.id))
	.where(eq(groupMembershipTable.userId, sql.placeholder('userId')))
	.orderBy(groupTable.id);

export const getUserGroupsAndProjects = async (
	userId: number
): Promise<GroupWithProjects[]> => {
	const results = await userGroupsAndProjectsQuery.execute({ userId });
	const groups: Record<
		number,
		{ id: number; name: string; projects: { id: number; name: string }[] }
	> = {};

	for (const {
		groupId,
		groupName,
		isOwner,
		projectId: id,
		projectName: name
	} of results) {
		const group = (groups[groupId] ||= {
			id: groupId,
			name: groupName,
			projects: []
		});

		if (id && name && isOwner) {
			group.projects.push({ id, name });
		}
	}

	return Object.values(groups);
};

const membershipQuery = db
	.select()
	.from(groupMembershipTable)
	.where(
		and(
			eq(groupMembershipTable.userId, sql.placeholder('userId')),
			eq(groupMembershipTable.groupId, sql.placeholder('groupId'))
		)
	)
	.limit(1);

export const isMemberOfGroup = (
	userId: number,
	groupId: number
): Promise<boolean> =>
	membershipQuery
		.execute({
			userId,
			groupId
		})
		.then(({ length }) => length > 0);

const groupMembersWithProjectsQuery = db
	.select({
		userId: userTable.id,
		firstname: userTable.firstname,
		lastname: userTable.lastname,
		photo: userTable.photo,
		role: userTable.role,
		projectId: roomTable.id,
		projectName: roomTable.name
	})
	.from(groupMembershipTable)
	.where(eq(groupMembershipTable.groupId, sql.placeholder('groupId')))
	.innerJoin(userTable, eq(groupMembershipTable.userId, userTable.id))
	.leftJoin(
		roomTable,
		and(eq(roomTable.ownerId, userTable.id), eq(roomTable.kind, 'project'))
	);

export const getGroupMembersWithProjects = async (groupId: number) => {
	try {
		return await groupMembersWithProjectsQuery.execute({ groupId });
	} catch (error) {
		console.error('Error querying group members with projects:', error);
		throw new Error('Failed to fetch group members with projects');
	}
};
