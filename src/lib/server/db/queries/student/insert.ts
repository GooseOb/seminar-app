import { db, studentLecturer, type NoId, type User } from '$lib/server/db';
import { insertUsers } from '../user/insert';

export const insertStudents = async (
	userDatas: NoId<User>[],
	lecturerId: number
) => {
	if (userDatas.length === 0) {
		return [];
	}
	const result = await insertUsers(userDatas);
	await db()
		.insert(studentLecturer)
		.values(
			result.map(({ id: studentId }) => ({
				studentId,
				lecturerId
			}))
		);

	return result;
};
