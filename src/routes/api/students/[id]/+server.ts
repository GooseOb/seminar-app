import {
	isStudentCreatedByLecturer,
	removeStudentFromGroup,
	getUserByLogin
} from '$lib/server/queries';
import { error, json, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params: { id: login } }) => {
	const student = await getUserByLogin(login);

	if (!student) {
		error(404, 'Student not found');
	}

	return json(student);
};

export const DELETE: RequestHandler = async ({
	locals,
	params: { id },
	request
}) => {
	const { groupId } = await request.json();

	if (!groupId) {
		error(400, 'Group ID is required');
	}

	try {
		await removeStudentFromGroup(+id, +groupId);
		return text('Student removed from group', {
			status: 200
		});
	} catch (err) {
		console.error('Error removing student from group:', err);
		error(500, 'Error removing student from group');
	}
};
