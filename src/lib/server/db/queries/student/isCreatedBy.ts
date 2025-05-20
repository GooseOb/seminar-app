import { db, studentLecturer } from '$lib/server/db';
import { eq, and, sql } from 'drizzle-orm';

export const getStudentCreatedBySubQuery = (userId: any) =>
	db()
		.select()
		.from(studentLecturer)
		.where(
			and(
				eq(studentLecturer.studentId, userId),
				eq(studentLecturer.lecturerId, sql.placeholder('lecturerId'))
			)
		);

const isStudentCreatedByQuery = () =>
	getStudentCreatedBySubQuery(sql.placeholder('studentId'))
		.limit(1)
		.prepare('isStudentCreatedByLecturerQuery');

export const isStudentCreatedBy = (studentId: number, lecturerId: number) =>
	isStudentCreatedByQuery()
		.execute({
			studentId,
			lecturerId
		})
		.then(({ length }) => length > 0);
