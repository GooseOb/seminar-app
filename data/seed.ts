import { insertUsers } from '../src/lib/server/db/queries/user/insert.ts';
import { insertGroupWithStudents } from '../src/lib/server/db/queries/group/insertWithStudents.ts';
import { insertProject } from '../src/lib/server/db/queries/project/insert.ts';

const password = '123';

const [lecturer] = await insertUsers([
	{
		firstname: 'Dr. Elizabeth',
		lastname: 'Thompson',
		login: 'lecturer',
		password,
		role: 'lecturer',
		hasPhoto: false
	}
]);

const { group, students } = await insertGroupWithStudents(
	'CS-301 Advanced Programming',
	lecturer.id,
	[
		{ firstname: 'Sophia', lastname: 'Rodriguez', login: '420524' },
		{ firstname: 'Michael', lastname: 'Chang', login: '420499' },
		{ firstname: 'Olivia', lastname: 'Patel', login: '420526' },
		{ firstname: 'William', lastname: 'Nguyen', login: '420520' },
		{ firstname: 'Isabella', lastname: 'Martinez', login: '420527' },
		{ firstname: 'Ethan', lastname: 'Kim', login: '420560' }
	].map(({ firstname, lastname, login }) => ({
		firstname,
		lastname,
		login,
		password,
		role: 'student',
		hasPhoto: false
	})),
	[]
);

await Promise.all(
	[
		{
			name: 'Smart Campus Navigation System',
			namePl: 'Inteligentny System Nawigacji Kampusowej',
			ownerId: students[0].id,
			description:
				'A mobile application for real-time campus navigation with AR integration and accessibility features',
			thesis:
				'Developing an efficient navigation system for university campuses using augmented reality'
		},
		{
			name: 'EcoTrack Energy Monitor',
			namePl: 'Monitor Energii EcoTrack',
			ownerId: students[1].id,
			description:
				'IoT-based solution for monitoring and optimizing energy consumption in university buildings',
			thesis: null
		}
	].map((project) => insertProject(group.id, project as any))
);

process.stdout.write('Database seeded successfully\n');
