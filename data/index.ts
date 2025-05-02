import type { User } from '../src/lib/server/db';
import {
	insertUser,
	insertStudent,
	insertProject,
	insertGroup
} from '../src/lib/server/queries';

const password = '123';

const lecturer = await insertUser({
	firstname: 'Jane',
	lastname: 'Doe',
	login: 'lecturer',
	password,
	role: 'lecturer',
	photo: null
});

const students: User[] = [];
for (const student of [
	{ firstname: 'Alice', lastname: 'Smith', login: '415060' },
	{ firstname: 'Bob', lastname: 'Jones', login: '415061' },
	{ firstname: 'Charlie', lastname: 'Brown', login: '415070' },
	{ firstname: 'David', lastname: 'Wilson', login: '415066' },
	{ firstname: 'Emma', lastname: 'Taylor', login: '415067' },
	{ firstname: 'Fiona', lastname: 'Clark', login: '415064' }
]) {
	const newStudent = await insertStudent(
		{
			firstname: student.firstname,
			lastname: student.lastname,
			login: student.login,
			password,
			role: 'student',
			photo: null
		},
		lecturer.id
	);
	students.push(newStudent);
}

const group = await insertGroup(
	{
		name: 'Study Group 1',
		ownerId: lecturer.id,
		kind: 'group'
	},
	lecturer.id,
	students
);

await insertProject(
	{
		name: 'Project Alpha',
		ownerId: students[0].id,
		kind: 'project'
	},
	group.id
);

await insertProject(
	{
		name: 'Project Beta',
		ownerId: students[1].id,
		kind: 'project'
	},
	group.id
);

console.log('Successfully inserted group, users, and projects');
