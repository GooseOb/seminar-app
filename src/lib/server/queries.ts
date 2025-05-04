import { alias } from 'drizzle-orm/pg-core';
import {
	db,
	groupMembershipTable as groupMembership,
	groupTable as group,
	projectTable as projectTable,
	roomTable as roomTable,
	userTable as user,
	studentLecturerTable as studentLecturer,
	type User,
	type NoId,
	type ProjectRoom
} from './db';
import { eq, and, sql, exists, getTableColumns } from 'drizzle-orm';
import { hashPassword } from './auth';

export type GroupWithProjects = {
	id: number;
	name: string;
	projects: {
		id: number;
		name: string;
	}[];
};

const projectRoom = alias(roomTable, 'project_room');
const userGroupsAndProjectsQuery = db
	.select({
		groupId: group.id,
		groupName: roomTable.name,
		isOwner: eq(roomTable.ownerId, sql.placeholder('userId')),
		projectId: projectTable.id,
		projectName: projectRoom.name
	})
	.from(groupMembership)
	.innerJoin(group, eq(groupMembership.groupId, group.id))
	.innerJoin(roomTable, eq(group.id, roomTable.id))
	.leftJoin(projectTable, eq(projectTable.groupId, group.id))
	.leftJoin(projectRoom, eq(projectTable.id, projectRoom.id))
	.where(eq(groupMembership.userId, sql.placeholder('userId')))
	.orderBy(group.id)
	.prepare('userGroupsAndProjectsQuery');

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
	.limit(1)
	.prepare('membershipQuery');

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
		login: user.login,
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
	)
	.prepare('groupMembersWithProjectsQuery');

export const getGroupMembersWithProjects = async (groupId: number) => {
	try {
		const members = await groupMembersWithProjectsQuery.execute({ groupId });

		const lecturer: Omit<(typeof members)[number], 'login'> = members.find(
			(member) => member.role === 'lecturer'
		)!;
		// @ts-expect-error Hide teacher login
		delete lecturer.login;

		return {
			lecturer,
			students: members.filter((member) => member.role === 'student')
		};
	} catch (error) {
		console.error('Error querying group members with projects:', error);
		throw new Error('Failed to fetch group members with projects');
	}
};

const getStudentCreatedByLecturerSubQuery = (userId: any) =>
	db
		.select()
		.from(studentLecturer)
		.where(
			and(
				eq(studentLecturer.studentId, userId),
				eq(studentLecturer.lecturerId, sql.placeholder('lecturerId'))
			)
		);

export const studentsInGroupQuery = db
	.select({
		id: user.id,
		firstname: user.firstname,
		lastname: user.lastname,
		login: user.login,
		photo: user.photo,
		canEdit: exists(getStudentCreatedByLecturerSubQuery(user.id))
	})
	.from(groupMembership)
	.where(
		and(
			eq(groupMembership.groupId, sql.placeholder('groupId')),
			eq(user.role, 'student')
		)
	)
	.innerJoin(user, eq(groupMembership.userId, user.id))
	.prepare('studentsInGroupQuery');

export const getStudentsInGroup = async (
	groupId: number,
	lecturerId: number
) => {
	return await studentsInGroupQuery.execute({
		groupId,
		lecturerId
	});
};

const isStudentCreatedByLecturerQuery = getStudentCreatedByLecturerSubQuery(
	sql.placeholder('studentId')
)
	.limit(1)
	.prepare('isStudentCreatedByLecturerQuery');

export const isStudentCreatedByLecturer = (
	studentId: number,
	lecturerId: number
) =>
	isStudentCreatedByLecturerQuery
		.execute({
			studentId,
			lecturerId
		})
		.then(({ length }) => length > 0);

const { password: _, ...userData } = getTableColumns(user);

const userByLoginQuery = db
	.select(userData)
	.from(user)
	.where(eq(user.login, sql.placeholder('login')))
	.limit(1)
	.prepare('userByLoginQuery');

export const getUserByLogin = async (login: string) => {
	return (await userByLoginQuery.execute({ login }))[0];
};

const userWithPasswordByLoginQuery = db
	.select()
	.from(user)
	.where(eq(user.login, sql.placeholder('login')))
	.limit(1)
	.prepare('userByLoginQuery');

export const getUserWithPasswordByLogin = async (login: string) => {
	return (await userWithPasswordByLoginQuery.execute({ login }))[0];
};

export const insertUsers = async (userDatas: NoId<User>[]) => {
	if (userDatas.length === 0) {
		return [];
	}
	for (const userData of userDatas) {
		userData.password = hashPassword(userData.password);
	}
	return await db.insert(user).values(userDatas).returning();
};

export const insertStudents = async (
	userDatas: NoId<User>[],
	lecturerId: number
) => {
	if (userDatas.length === 0) {
		return [];
	}
	const result = await insertUsers(userDatas);
	await db.insert(studentLecturer).values(
		result.map(({ id: studentId }) => ({
			studentId,
			lecturerId
		}))
	);

	return result;
};

const insertRoomQuery = db
	.insert(roomTable)
	.values({
		name: sql.placeholder('name'),
		ownerId: sql.placeholder('ownerId'),
		kind: sql.placeholder('kind')
	})
	.returning()
	.prepare('insertRoomQuery');

const insertProjectQuery = db
	.insert(projectTable)
	.values({
		id: sql.placeholder('id'),
		groupId: sql.placeholder('groupId'),
		namePl: sql.placeholder('namePl'),
		description: sql.placeholder('description'),
		thesis: sql.placeholder('thesis')
	})
	.prepare('insertProjectQuery');

export const insertProject = async (
	room: Optional<NoId<ProjectRoom>, 'kind'>,
	groupId: number
) => {
	room.kind = 'project';
	const [result] = await insertRoomQuery.execute(room);
	await insertProjectQuery.execute({
		id: result.id,
		groupId,
		namePl: room.namePl,
		description: room.description,
		thesis: room.thesis
	});
	return result;
};

export const insertGroup = async (name: string, lecturerId: number) => {
	const [result] = await insertRoomQuery.execute({
		name,
		ownerId: lecturerId,
		kind: 'group'
	});

	await db.insert(group).values({
		id: result.id
	});

	return result;
};

export const insertGroupMembers = async (
	studentIds: number[],
	groupId: number
) => {
	await db.insert(groupMembership).values(
		studentIds.map((studentId) => ({
			userId: studentId,
			groupId
		}))
	);
};

export const insertGroupWithStudents = async (
	name: string,
	lecturerId: number,
	students: NoId<User>[],
	inviteeIds: number[]
) => {
	const studentsWithIds = students.length
		? await insertStudents(students, lecturerId)
		: [];
	const group = await insertGroup(name, lecturerId);

	await insertGroupMembers(
		[...studentsWithIds.map(({ id }) => id), ...inviteeIds, lecturerId],
		group.id
	);

	return {
		group: group,
		students: studentsWithIds
	};
};

const removeStudentFromGroupQuery = db
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
	await removeStudentFromGroupQuery.execute({
		studentId,
		groupId
	});
};
