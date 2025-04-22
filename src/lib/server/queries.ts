import { alias } from 'drizzle-orm/pg-core';
import {
	db,
	groupMembershipTable,
	groupTable,
	projectTable,
	roomTable,
	userTable
} from './db';
import { eq, and } from 'drizzle-orm';

export type GroupWithProjects = {
	id: number;
	name: string;
	projects: {
		id: number;
		name: string;
	}[];
};

export const getUserGroupsAndProjects = async (
	userId: number
): Promise<GroupWithProjects[]> => {
	const projectRoomTable = alias(roomTable, 'project_room');
	const results = await db
		.select({
			groupId: groupTable.id,
			groupName: roomTable.name,
			isOwner: eq(roomTable.ownerId, userId),
			projectId: projectTable.id,
			projectName: projectRoomTable.name
		})
		.from(groupMembershipTable)
		.innerJoin(groupTable, eq(groupMembershipTable.groupId, groupTable.id))
		.innerJoin(roomTable, eq(groupTable.id, roomTable.id))
		.leftJoin(projectTable, eq(projectTable.groupId, groupTable.id))
		.leftJoin(projectRoomTable, eq(projectTable.id, projectRoomTable.id))
		.where(eq(groupMembershipTable.userId, userId))
		.orderBy(groupTable.id);

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

export const isMemberOfGroup = async (
	userId: number,
	groupId: number
): Promise<boolean> => {
	const { length } = await db
		.select()
		.from(groupMembershipTable)
		.where(
			and(
				eq(groupMembershipTable.userId, userId),
				eq(groupMembershipTable.groupId, groupId)
			)
		)
		.limit(1);

	return length > 0;
};

export const getGroupMembersWithProjects = async (groupId: number) => {
	try {
		return await db
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
			.where(eq(groupMembershipTable.groupId, groupId))
			.innerJoin(userTable, eq(groupMembershipTable.userId, userTable.id))
			.leftJoin(
				roomTable,
				and(eq(roomTable.ownerId, userTable.id), eq(roomTable.kind, 'project'))
			);
	} catch (error) {
		console.error('Error querying group members with projects:', error);
		throw new Error('Failed to fetch group members with projects');
	}
};
