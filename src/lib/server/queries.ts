import { alias } from 'drizzle-orm/pg-core';
import {
	db,
	groupMembershipTable as groupMembership,
	groupTable as group,
	projectTable as projectTable,
	roomTable as roomTable,
	userTable as user,
	type User,
	studentLecturerTable as studentLecturer,
	type Room,
	type NoId,
	studentLecturerTable
} from './db';
import { eq, and, sql, exists } from 'drizzle-orm';
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

const userByLoginQuery = db
	.select()
	.from(user)
	.where(eq(user.login, sql.placeholder('login')))
	.limit(1)
	.prepare('userByLoginQuery');

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
		role: sql.placeholder('role'),
		photo: sql.placeholder('photo')
	})
	.returning()
	.prepare('insertUserQuery');

export const insertUser = async (userData: NoId<User>) => {
	userData.password = hashPassword(userData.password);
	return (await insertUserQuery.execute(userData))[0];
};

export const insertLecturerStudentQuery = db.insert(studentLecturer).values({
	studentId: sql.placeholder('studentId'),
	lecturerId: sql.placeholder('lecturerId')
});

export const insertStudent = async (
	userData: NoId<User>,
	lecturerId: number
) => {
	const result = await insertUser(userData);
	await insertLecturerStudentQuery.execute({
		studentId: result.id,
		lecturerId
	});
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
		groupId: sql.placeholder('groupId')
	})
	.prepare('insertProjectQuery');

export const insertProject = async (room: NoId<Room>, groupId: number) => {
	const [result] = await insertRoomQuery.execute(room);
	await insertProjectQuery.execute({
		id: result.id,
		groupId
	});
	return result;
};

export const insertGroup = async (
	name: string,
	lecturerId: number,
	students: { id: number }[]
) => {
	const [result] = await insertRoomQuery.execute({
		name,
		ownerId: lecturerId,
		kind: 'group'
	});

	await db.insert(group).values({
		id: result.id
	});

	const memberships = [
		{ userId: lecturerId, groupId: result.id },
		...students.map(({ id }) => ({
			userId: id,
			groupId: result.id
		}))
	];
	await db.insert(groupMembership).values(memberships);

	return result;
};

export const insertGroupWithStudents = async (
	name: string,
	lecturerId: number,
	students: NoId<User>[]
) => {
	const studentsWithIds = await Promise.all(
		students.map((student) => insertStudent(student, lecturerId))
	);
	return {
		group: await insertGroup(name, lecturerId, studentsWithIds),
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
