import { type NoId, type User } from '$lib/server/db';
import { insertStudents } from '../student/insert';
import { insertGroup } from './insert';
import { insertGroupMembers } from './insertMembers';

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
