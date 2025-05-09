import { alias } from 'drizzle-orm/pg-core';
import {
	db,
	groupMembershipTable as groupMembership,
	groupTable as group,
	projectTable as project,
	roomTable as room,
	userTable as user,
	studentLecturerTable as studentLecturer,
	messageTable as message,
	type User,
	type NoId,
	type ProjectRoom
} from './db';
import { eq, and, sql, exists, getTableColumns, or } from 'drizzle-orm';
import { hashPassword } from './auth';

const { password: _, ...userData } = getTableColumns(user);

const projectRoom = alias(room, 'project_room');
const userGroupsAndProjectsQuery = db
	.select({
		groupId: group.id,
		groupName: room.name,
		isOwner: eq(room.ownerId, sql.placeholder('userId')),
		projectId: project.id,
		projectOwnerFirstName: user.firstname,
		projectOwnerLastName: user.lastname,
		projectOwnerStudentNumber: user.login,
		projectNameEN: projectRoom.name,
		projectNamePL: project.namePl
	})
	.from(groupMembership)
	.innerJoin(group, eq(groupMembership.groupId, group.id))
	.innerJoin(room, eq(group.id, room.id))
	.leftJoin(project, eq(project.groupId, group.id))
	.leftJoin(projectRoom, eq(project.id, projectRoom.id))
	.leftJoin(user, eq(user.id, projectRoom.ownerId))
	.where(eq(groupMembership.userId, sql.placeholder('userId')))
	.orderBy(group.id)
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
	const results = await userGroupsAndProjectsQuery.execute({ userId });
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

const getProjectQuery = db
	.select({
		name: room.name,
		ownerId: room.ownerId,
		namePl: project.namePl,
		description: project.description,
		thesis: project.thesis
	})
	.from(room)
	.where(and(eq(room.id, sql.placeholder('id'))))
	.innerJoin(project, eq(project.id, room.id))
	.limit(1)
	.prepare('getProjectQuery');

export const getProject = async (id: number) => {
	return (await getProjectQuery.execute({ id }))[0];
};

const getUserByIdQuery = db
	.select(userData)
	.from(user)
	.where(eq(user.id, sql.placeholder('id')))
	.limit(1)
	.prepare('getUserByIdQuery');

export const getUserById = async (id: number) => {
	return (await getUserByIdQuery.execute({ id }))[0];
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
		projectId: room.id,
		projectNameEN: room.name,
		projectNamePl: project.namePl
	})
	.from(groupMembership)
	.innerJoin(
		user,
		and(eq(groupMembership.userId, user.id), eq(user.role, 'student'))
	)
	.leftJoin(
		room,
		and(
			eq(room.ownerId, user.id),
			eq(room.kind, 'project'),
			exists(
				db
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
	.where(eq(groupMembership.groupId, sql.placeholder('groupId')))
	.prepare('groupMembersWithProjectsQuery');

const getGroupOwnerQuery = db
	.select({
		id: user.id,
		firstname: user.firstname,
		lastname: user.lastname,
		photo: user.photo
	})
	.from(user)
	.innerJoin(
		room,
		and(eq(user.id, room.ownerId), eq(sql.placeholder('groupId'), room.id))
	)
	.limit(1)
	.prepare('getGroupOwnerQuery');

export const getGroupOwner = async (groupId: number) => {
	return (await getGroupOwnerQuery.execute({ groupId }))[0];
};

export const getStudentsWithProjectsInGroup = async (groupId: number) => {
	return await groupMembersWithProjectsQuery.execute({
		groupId
	});
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

const getGroupNameQuery = db
	.select({
		name: room.name
	})
	.from(room)
	.where(and(eq(room.id, sql.placeholder('groupId'))))
	.limit(1)
	.prepare('getGroupNameQuery');

export const getGroupName = async (groupId: number) => {
	const [result] = await getGroupNameQuery.execute({ groupId });
	return result?.name;
};

const updateRoomNameQuery = db
	.update(room)
	.set({
		name: sql.placeholder('name') as any
	})
	.where(eq(room.id, sql.placeholder('id')))
	.prepare('updateRoomNameQuery');

export const updateRoomName = async (id: number, name: string) => {
	await updateRoomNameQuery.execute({
		id,
		name
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
	.insert(room)
	.values({
		name: sql.placeholder('name'),
		ownerId: sql.placeholder('ownerId'),
		kind: sql.placeholder('kind')
	})
	.returning()
	.prepare('insertRoomQuery');

const insertProjectQuery = db
	.insert(project)
	.values({
		id: sql.placeholder('id'),
		groupId: sql.placeholder('groupId'),
		namePl: sql.placeholder('namePl'),
		description: sql.placeholder('description'),
		thesis: sql.placeholder('thesis')
	})
	.prepare('insertProjectQuery');

export const insertProject = async (
	roomData: Optional<NoId<ProjectRoom>, 'kind'>,
	groupId: number
) => {
	roomData.kind = 'project';
	const [result] = await insertRoomQuery.execute(roomData);
	await insertProjectQuery.execute({
		id: result.id,
		groupId,
		namePl: roomData.namePl,
		description: roomData.description,
		thesis: roomData.thesis
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
	groupId: number,
	studentIds: number[]
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

	await insertGroupMembers(group.id, [
		...studentsWithIds.map(({ id }) => id),
		...inviteeIds,
		lecturerId
	]);

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

const deleteGroupMembershipsQuery = db
	.delete(groupMembership)
	.where(eq(groupMembership.groupId, sql.placeholder('groupId')))
	.prepare('deleteGroupMembershipQuery');

const deleteGroupQuery = db
	.delete(group)
	.where(eq(group.id, sql.placeholder('groupId')))
	.prepare('deleteGroupQuery');

export const deleteGroup = async (groupId: number) => {
	await deleteGroupMembershipsQuery.execute({
		groupId
	});
	await deleteGroupQuery.execute({
		groupId
	});
};

// <NOT CURRENTLY USED>
// either user is owner, or user is owner of the group the project belongs to
const hasAccessToProjectQuery = db
	.select()
	.from(projectRoom)
	.where(
		and(
			eq(projectRoom.id, sql.placeholder('projectId')),
			or(
				eq(projectRoom.ownerId, sql.placeholder('userId')),
				exists(
					db
						.select()
						.from(room)
						.where(eq(room.ownerId, sql.placeholder('userId')))
				)
			)
		)
	);

export const hasAccessToProject = (
	projectId: number,
	userId: number
): Promise<boolean> =>
	hasAccessToProjectQuery
		.execute({
			projectId,
			userId
		})
		.then(({ length }) => length > 0);
// </NOT CURRENTLY USED>

const updateProjectQuery = db
	.update(project)
	.set({
		namePl: sql.placeholder('namePl') as any,
		description: sql.placeholder('description') as any,
		thesis: sql.placeholder('thesis') as any
	})
	.where(eq(project.id, sql.placeholder('id')))
	.prepare('updateProjectQuery');

export const updateProject = async (
	id: number,
	data: {
		name: string;
		namePl: string;
		description: string;
		thesis: string;
	}
) => {
	await Promise.all([
		updateProjectQuery.execute({
			id,
			namePl: data.namePl,
			description: data.description,
			thesis: data.thesis
		}),
		updateRoomName(id, data.name)
	]);
};

export type UserUpdateData = {
	firstname: string;
	lastname: string;
	login: string;
	password?: string;
};

export const updateUser = async (id: number, data: UserUpdateData) => {
	await db.update(user).set(data).where(eq(user.id, id)).execute();
};

const insertedMessage = db.$with('inserted_message').as(
	db
		.insert(message)
		.values({
			senderId: sql.placeholder('senderId'),
			roomId: sql.placeholder('roomId'),
			text: sql.placeholder('text')
		})
		.returning({
			id: message.id,
			roomId: message.roomId,
			senderId: message.senderId,
			text: message.text,
			createdAt: message.createdAt
		})
);

const insertMessageQuery = db
	.with(insertedMessage)
	.select({
		id: insertedMessage.id,
		roomId: insertedMessage.roomId,
		sender: {
			id: user.id,
			firstname: user.firstname,
			lastname: user.lastname
		},
		text: insertedMessage.text,
		createdAt: insertedMessage.createdAt
	})
	.from(insertedMessage)
	.innerJoin(user, eq(insertedMessage.senderId, user.id))
	.prepare('sendMessageQuery');

export const insertMessage = async (value: {
	senderId: number;
	roomId: number;
	text: string;
}) => {
	return (await insertMessageQuery.execute(value))[0];
};

const getMessagesQuery = db
	.select({
		id: message.id,
		createdAt: message.createdAt,
		roomId: message.roomId,
		senderId: message.senderId,
		senderFirstname: user.firstname,
		senderLastname: user.lastname,
		text: message.text
	})
	.from(message)
	.innerJoin(user, eq(message.senderId, user.id))
	.where(eq(message.roomId, sql.placeholder('roomId')))
	.orderBy(message.createdAt)
	.prepare('getMessagesQuery');

export type ReceivedMessage = {
	id: number;
	roomId: number;
	sender: {
		id: number;
		firstname: string;
		lastname: string;
	};
	text: string;
	createdAt: Date;
};

export const getMessages = async (roomId: number) => {
	const messages = await getMessagesQuery.execute({ roomId });
	return messages.map(
		({
			id,
			createdAt,
			roomId,
			senderId,
			senderFirstname,
			senderLastname,
			text
		}) => ({
			id,
			roomId,
			sender: {
				id: senderId,
				firstname: senderFirstname,
				lastname: senderLastname
			},
			text,
			createdAt
		})
	);
};
