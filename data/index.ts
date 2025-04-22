import {
	db,
	groupMembershipTable,
	groupTable,
	projectTable,
	roomTable,
	userTable,
	type User
} from '../src/lib/server/db';
import {
	createSession,
	generateSessionToken
} from '../src/lib/server/sessions';
import { hashPassword } from '../src/lib/server/auth';

try {
	const hashedPassword = hashPassword('123');

	// Create teacher
	const [teacher] = await db
		.insert(userTable)
		.values({
			firstname: 'Jane',
			lastname: 'Doe',
			email: 'teacher@example.com',
			password: hashedPassword,
			role: 'teacher'
		})
		.returning();
	const teacherToken = generateSessionToken();
	await createSession(teacherToken, teacher.id);

	// Create students
	const studentsData = [
		{ firstname: 'Alice', lastname: 'Smith', email: 'alice@example.com' },
		{ firstname: 'Bob', lastname: 'Jones', email: 'bob@example.com' },
		{ firstname: 'Charlie', lastname: 'Brown', email: 'charlie@example.com' },
		{ firstname: 'David', lastname: 'Wilson', email: 'david@example.com' },
		{ firstname: 'Emma', lastname: 'Taylor', email: 'emma@example.com' },
		{ firstname: 'Fiona', lastname: 'Clark', email: 'fiona@example.com' }
	];

	const students: User[] = [];
	for (const student of studentsData) {
		const [newStudent] = await db
			.insert(userTable)
			.values({
				firstname: student.firstname,
				lastname: student.lastname,
				email: student.email,
				password: hashedPassword,
				role: 'student'
			})
			.returning();
		const studentToken = generateSessionToken();
		await createSession(studentToken, newStudent.id);
		students.push(newStudent);
	}

	// Create group room
	const [groupRoom] = await db
		.insert(roomTable)
		.values({
			name: 'Study Group 1',
			ownerId: teacher.id, // Teacher can still own the group
			kind: 'group'
		})
		.returning();

	await db.insert(groupTable).values({
		id: groupRoom.id
	});

	// Create group memberships
	const memberships = [
		{ userId: teacher.id, groupId: groupRoom.id },
		...students.map((student) => ({
			userId: student.id,
			groupId: groupRoom.id
		}))
	];

	await db.insert(groupMembershipTable).values(memberships);

	// Create projects owned by students
	const [projectAlphaRoom] = await db
		.insert(roomTable)
		.values({
			name: 'Project Alpha',
			ownerId: students[0].id, // First student owns Project Alpha
			kind: 'project'
		})
		.returning();

	await db.insert(projectTable).values({
		id: projectAlphaRoom.id,
		groupId: groupRoom.id
	});

	const [projectBetaRoom] = await db
		.insert(roomTable)
		.values({
			name: 'Project Beta',
			ownerId: students[1].id, // Second student owns Project Beta
			kind: 'project'
		})
		.returning();

	await db.insert(projectTable).values({
		id: projectBetaRoom.id,
		groupId: groupRoom.id
	});

	console.log('Successfully inserted group, users, and projects');
} catch (error) {
	console.error('Error inserting data:', error);
}
