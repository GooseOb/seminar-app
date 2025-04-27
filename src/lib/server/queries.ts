import { alias } from 'drizzle-orm/pg-core';
import {
	db,
	groupMembershipTable as groupMembership,
	groupTable as group,
	projectTable as project,
	roomTable as room,
	userTable as user,
	type User
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

const projectRoom = alias(room, 'project_room');
const userGroupsAndProjectsQuery = db
	.select({
		groupId: group.id,
		groupName: room.name,
		isOwner: eq(room.ownerId, sql.placeholder('userId')),
		projectId: project.id,
		projectName: projectRoom.name
	})
	.from(groupMembership)
	.innerJoin(group, eq(groupMembership.groupId, group.id))
	.innerJoin(room, eq(group.id, room.id))
	.leftJoin(project, eq(project.groupId, group.id))
	.leftJoin(projectRoom, eq(project.id, projectRoom.id))
	.where(eq(groupMembership.userId, sql.placeholder('userId')))
	.orderBy(group.id);

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
	.from(groupMembership)
	.where(
		and(
			eq(groupMembership.userId, sql.placeholder('userId')),
			eq(groupMembership.groupId, sql.placeholder('groupId'))
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
		userId: user.id,
		firstname: user.firstname,
		lastname: user.lastname,
		photo: user.photo,
		role: user.role,
		projectId: projectRoom.id,
		projectName: projectRoom.name
	})
	.from(groupMembership)
	.where(eq(groupMembership.groupId, sql.placeholder('groupId')))
	.innerJoin(user, eq(groupMembership.userId, user.id))
	.leftJoin(
		projectRoom,
		and(eq(projectRoom.ownerId, user.id), eq(projectRoom.kind, 'project'))
	);

export const getGroupMembersWithProjects = async (groupId: number) => {
	try {
		const members = await groupMembersWithProjectsQuery.execute({ groupId });

		return {
			lecturer: members.find((member) => member.role === 'lecturer')!,
			students: members.filter((member) => member.role === 'student')
		};
	} catch (error) {
		console.error('Error querying group members with projects:', error);
		throw new Error('Failed to fetch group members with projects');
	}
};

const userByLoginQuery = db
	.select()
	.from(user)
	.where(eq(user.login, sql.placeholder('login')))
	.limit(1);

export const getUserByLogin = async (login: string) => {
	return await userByLoginQuery.execute({ login });
};

const insertUserQuery = db
	.insert(user)
	.values({
		firstname: sql.placeholder('firstname'),
		lastname: sql.placeholder('lastname'),
		login: sql.placeholder('login'),
		password: sql.placeholder('password'),
		role: sql.placeholder('role')
	})
	.returning();

export const insertUser = async (userData: Omit<User, 'id' | 'photo'>) => {
	return await insertUserQuery.execute(userData);
};
