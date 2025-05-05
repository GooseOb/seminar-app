import {
	isStudentCreatedByLecturer,
	removeStudentFromGroup,
	getUserByLogin
} from '$lib/server/queries';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params: { id: login } }) => {
	const student = await getUserByLogin(login);

	if (!student) {
		return new Response('Student not found', { status: 404 });
	}

	return new Response(JSON.stringify(student), {
		headers: { 'Content-Type': 'application/json' }
	});
};

export const DELETE: RequestHandler = async ({
	locals,
	params: { id },
	request
}) => {
	const { groupId } = await request.json();

	if (!groupId) {
		if (await isStudentCreatedByLecturer(+id, locals.user!.id)) {
			// TODO: handle account deletion
			return new Response('Missing group ID', { status: 400 });
		} else {
			return new Response(
				'Only the lecturer who created the student account, can delete it',
				{ status: 401 }
			);
		}
	}

	try {
		await removeStudentFromGroup(+id, +groupId);
		return new Response('Student removed from group', { status: 200 });
	} catch (err) {
		console.error('Error removing student from group:', err);
		return new Response('Error removing student from group', { status: 500 });
	}
};
