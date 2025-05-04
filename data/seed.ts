import {
	insertUsers,
	insertProject,
	insertGroupWithStudents
} from '../src/lib/server/queries';

const password = '123';

const [lecturer] = await insertUsers([
	{
		firstname: 'Dr. Elizabeth',
		lastname: 'Thompson',
		login: 'lecturer',
		password,
		role: 'lecturer',
		photo: null
	}
]);

const { group, students } = await insertGroupWithStudents(
	'CS-301 Advanced Programming',
	lecturer.id,
	[
		{ firstname: 'Sophia', lastname: 'Rodriguez', login: 'srodriguez24' },
		{ firstname: 'Michael', lastname: 'Chang', login: 'mchang25' },
		{ firstname: 'Olivia', lastname: 'Patel', login: 'opatel23' },
		{ firstname: 'William', lastname: 'Nguyen', login: 'wnguyen26' },
		{ firstname: 'Isabella', lastname: 'Martinez', login: 'imartinez24' },
		{ firstname: 'Ethan', lastname: 'Kim', login: 'ekim25' }
	].map(({ firstname, lastname, login }) => ({
		firstname,
		lastname,
		login,
		password,
		role: 'student',
		photo: null
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
	].map((project) => insertProject(project as any, group.id))
);

process.stdout.write('Database seeded successfully\n');
