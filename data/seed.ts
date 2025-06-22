import { insertUsers } from '../src/lib/server/db/queries/user/insert.ts';
import { insertGroupWithStudents } from '../src/lib/server/db/queries/group/insertWithStudents.ts';
import { insertProject } from '../src/lib/server/db/queries/project/insert.ts';

const password = '123';

const lecturers = await insertUsers([
	{
		firstname: 'Dr Elżbieta',
		lastname: 'Thompson',
		login: 'lecturer',
		password,
		role: 'lecturer',
		hasPhoto: false
	},
	{
		firstname: 'Prof. Adam',
		lastname: 'Kowalski',
		login: 'lecturer2',
		password,
		role: 'lecturer',
		hasPhoto: false
	}
]);

const mapStudents = (
	value: { firstname: string; lastname: string; login: string }[]
) =>
	value.map(({ firstname, lastname, login }) => ({
		firstname,
		lastname,
		login,
		password,
		role: 'student',
		hasPhoto: false
	}));

const groups = await Promise.all([
	insertGroupWithStudents(
		'Grupa 1 - Środa 10:15',
		lecturers[0].id,
		mapStudents([
			{ firstname: 'Zofia', lastname: 'Rodriguez', login: '420524' },
			{ firstname: 'Michał', lastname: 'Chang', login: '420499' },
			{ firstname: 'Oliwia', lastname: 'Patel', login: '420526' },
			{ firstname: 'William', lastname: 'Nguyen', login: '420520' },
			{ firstname: 'Izabela', lastname: 'Martinez', login: '420527' },
			{ firstname: 'Eryk', lastname: 'Kim', login: '420560' }
		]),
		[]
	),
	insertGroupWithStudents(
		'Grupa 2 - Poniedziałek 14:30',
		lecturers[0].id,
		mapStudents([
			{ firstname: 'Jakub', lastname: 'Anderson', login: '420531' },
			{ firstname: 'Natalia', lastname: 'Wilson', login: '420532' },
			{ firstname: 'Kacper', lastname: 'Johnson', login: '420533' },
			{ firstname: 'Julia', lastname: 'Brown', login: '420534' },
			{ firstname: 'Filip', lastname: 'Davis', login: '420535' },
			{ firstname: 'Wiktoria', lastname: 'Miller', login: '420536' },
			{ firstname: 'Szymon', lastname: 'Garcia', login: '420537' },
			{ firstname: 'Maja', lastname: 'Rodriguez', login: '420538' }
		]),
		[]
	),
	insertGroupWithStudents(
		'Grupa 3 - Piątek 12:00',
		lecturers[0].id,
		mapStudents([
			{ firstname: 'Aleksander', lastname: 'Thompson', login: '420539' },
			{ firstname: 'Emilia', lastname: 'White', login: '420540' },
			{ firstname: 'Mateusz', lastname: 'Lopez', login: '420541' },
			{ firstname: 'Amelia', lastname: 'Lee', login: '420542' },
			{ firstname: 'Bartosz', lastname: 'Gonzalez', login: '420543' },
			{ firstname: 'Lena', lastname: 'Harris', login: '420544' },
			{ firstname: 'Dawid', lastname: 'Clark', login: '420545' }
		]),
		[]
	),
	insertGroupWithStudents(
		'Grupa 4 - Wtorek 16:00',
		lecturers[1].id,
		mapStudents([
			{ firstname: 'Oskar', lastname: 'Lewis', login: '420546' },
			{ firstname: 'Zuzanna', lastname: 'Robinson', login: '420547' },
			{ firstname: 'Igor', lastname: 'Walker', login: '420548' },
			{ firstname: 'Hanna', lastname: 'Perez', login: '420549' },
			{ firstname: 'Hubert', lastname: 'Hall', login: '420550' },
			{ firstname: 'Liliana', lastname: 'Young', login: '420551' }
		]),
		[]
	),
	insertGroupWithStudents(
		'Grupa 5 - Czwartek 09:00',
		lecturers[1].id,
		mapStudents([
			{ firstname: 'Natan', lastname: 'Allen', login: '420552' },
			{ firstname: 'Kornelia', lastname: 'Sanchez', login: '420553' },
			{ firstname: 'Marcel', lastname: 'Wright', login: '420554' },
			{ firstname: 'Antonina', lastname: 'King', login: '420555' },
			{ firstname: 'Tymoteusz', lastname: 'Scott', login: '420556' },
			{ firstname: 'Klara', lastname: 'Green', login: '420557' },
			{ firstname: 'Adrian', lastname: 'Adams', login: '420558' },
			{ firstname: 'Nikola', lastname: 'Baker', login: '420559' }
		]),
		[]
	)
]);

const projects = await Promise.all(
	[
		[
			{
				name: 'Smart Campus Navigation System',
				namePl: 'Inteligentny System Nawigacji Kampusowej',
				ownerId: groups[0].students[0].id,
				description:
					'Mobilna aplikacja do nawigacji po kampusie w czasie rzeczywistym z integracją AR i funkcjami dostępności',
				thesis:
					'Opracowanie wydajnego systemu nawigacji dla kampusów uniwersyteckich z wykorzystaniem rzeczywistości rozszerzonej'
			},
			{
				name: 'EcoTrack Energy Monitor',
				namePl: 'Monitor Energii EcoTrack',
				ownerId: groups[0].students[1].id,
				description:
					'Rozwiązanie oparte na IoT do monitorowania i optymalizacji zużycia energii w budynkach uczelni',
				thesis: null
			}
		],
		[
			{
				name: 'StudyBuddy AI Tutor',
				namePl: 'StudyBuddy - Sztuczny Korepetytor',
				ownerId: groups[1].students[0].id,
				description:
					'Platforma e-learningowa z asystentem AI oferującym spersonalizowane wsparcie edukacyjne',
				thesis:
					'Wykorzystanie sztucznej inteligencji w personalizacji procesu uczenia się studentów'
			},
			{
				name: 'Digital Library Manager',
				namePl: 'Menedżer Biblioteki Cyfrowej',
				ownerId: groups[1].students[1].id,
				description:
					'System zarządzania zasobami bibliotecznymi z funkcjami wyszukiwania semantycznego',
				thesis: null
			},
			{
				name: 'Virtual Lab Simulator',
				namePl: 'Symulator Laboratorium Wirtualnego',
				ownerId: groups[1].students[2].id,
				description:
					'Aplikacja VR do przeprowadzania eksperymentów chemicznych w środowisku wirtualnym',
				thesis:
					'Implementacja wirtualnej rzeczywistości w edukacji chemicznej na poziomie uniwersyteckim'
			}
		],
		[
			{
				name: 'HealthTrack Wearable Analytics',
				namePl: 'HealthTrack - Analityka Urządzeń Ubieralnych',
				ownerId: groups[2].students[0].id,
				description:
					'Platforma do analizy danych zdrowotnych z urządzeń ubieralnych z przewidywaniem trendów',
				thesis:
					'Machine learning w analizie danych biometrycznych dla profilaktyki zdrowotnej'
			},
			{
				name: 'Smart Parking System',
				namePl: 'Inteligentny System Parkingowy',
				ownerId: groups[2].students[1].id,
				description:
					'IoT solution dla optymalizacji wykorzystania miejsc parkingowych na kampusie',
				thesis: null
			}
		],
		[
			{
				name: 'CodeReview Assistant',
				namePl: 'Asystent Przeglądu Kodu',
				ownerId: groups[3].students[0].id,
				description:
					'Narzędzie AI do automatycznego przeglądu kodu z wykrywaniem błędów i sugestiami optymalizacji',
				thesis:
					'Automatyzacja procesów code review z wykorzystaniem technik przetwarzania języka naturalnego'
			},
			{
				name: 'Recipe Recommendation Engine',
				namePl: 'Silnik Rekomendacji Przepisów',
				ownerId: groups[3].students[1].id,
				description:
					'Aplikacja mobilna rekomendująca przepisy na podstawie preferencji dietetycznych i dostępnych składników',
				thesis: null
			},
			{
				name: 'Social Impact Tracker',
				namePl: 'Śledzenie Wpływu Społecznego',
				ownerId: groups[3].students[2].id,
				description:
					'Platforma do monitorowania i mierzenia wpływu społecznego projektów non-profit',
				thesis:
					'Metodologie pomiaru wpływu społecznego w erze cyfrowej transformacji'
			}
		],
		[
			{
				name: 'Blockchain Voting System',
				namePl: 'System Głosowania Blockchain',
				ownerId: groups[4].students[0].id,
				description:
					'Bezpieczny system głosowania wykorzystujący technologię blockchain dla wyborów studenckich',
				thesis:
					'Implementacja technologii blockchain w demokratycznych procesach decyzyjnych'
			},
			{
				name: 'Mental Health Chatbot',
				namePl: 'Chatbot Zdrowia Psychicznego',
				ownerId: groups[4].students[1].id,
				description:
					'Chatbot wspierający zdrowie psychiczne studentów z integracją z profesjonalną pomocą',
				thesis: null
			},
			{
				name: 'Sustainable Transport Planner',
				namePl: 'Planer Zrównoważonego Transportu',
				ownerId: groups[4].students[2].id,
				description:
					'Aplikacja planująca najefektywniejsze ekologicznie trasy transportu miejskiego',
				thesis:
					'Optymalizacja transportu miejskiego pod kątem zrównoważonego rozwoju z wykorzystaniem big data'
			},
			{
				name: 'AR Museum Guide',
				namePl: 'Przewodnik Muzealny AR',
				ownerId: groups[4].students[3].id,
				description:
					'Aplikacja rzeczywistości rozszerzonej oferująca interaktywne zwiedzanie muzeów',
				thesis: null
			}
		]
	].flatMap((projects, i) =>
		projects.map((project) => insertProject(groups[i].group.id, project as any))
	)
);

process.stdout.write(`Database seeded successfully with:
- ${lecturers.length} lecturers
- ${groups.length} groups
- ${groups.reduce((sum, g) => sum + g.students.length, 0)} students
- ${projects.length} projects
`);

// Uploading pdfs and images to S3
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { insertFileMetadata } from '../src/lib/server/db/queries/file.ts';
import { setUserHasPhoto } from '../src/lib/server/db/queries/user/updateHasPhoto.ts';

const s3 = new S3Client({
	region: 'auto',
	endpoint: process.env.S3_ENDPOINT!,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY_ID!,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!
	}
});

const thesisDir = path.resolve(import.meta.dirname, 'thesis');

const uploadThesis = async (projectId: number, fileName: string) => {
	const Key = `rooms/${projectId}/thesis/${Date.now()}.pdf`;
	await s3.send(
		new PutObjectCommand({
			Bucket: process.env.S3_BUCKET!,
			Key,
			Body: readFileSync(path.join(thesisDir, fileName)),
			ContentType: 'application/pdf'
		})
	);
	await insertFileMetadata(Key);
};

const imageDir = path.resolve(import.meta.dirname, 'images');

const uploadImage = async (userId: number, fileName: string) => {
	await s3.send(
		new PutObjectCommand({
			Bucket: process.env.S3_PUB_BUCKET!,
			Key: `users/${userId}/image`,
			Body: readFileSync(path.join(imageDir, fileName)),
			ContentType: 'image/jpeg'
		})
	);
	await setUserHasPhoto(userId, true);
};

await uploadThesis(projects[0].id, '1.pdf');
await uploadThesis(projects[0].id, '2.pdf');

const { length: imagesUploaded } = await Promise.all([
	uploadImage(lecturers[0].id, '1.jpg'),
	uploadImage(groups[0].students[0].id, '2.jpg')
]);

process.stdout.write(`Files uploaded successfully:
- 2 thesis versions for project ${projects[0].id}
- ${imagesUploaded} profile images
`);
