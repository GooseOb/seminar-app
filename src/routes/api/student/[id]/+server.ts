import {
	isStudentCreatedByLecturer,
	removeStudentFromGroup
} from '$lib/server/queries';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({
	locals,
	params: { id },
	request
}) => {
	const { groupId } = await request.json();
	console.log(id, await isStudentCreatedByLecturer(+id, locals.user.id));
	if (
		!locals.user ||
		!(await isStudentCreatedByLecturer(+id, locals.user.id))
	) {
		return new Response('Unauthorized', { status: 401 });
	}

	if (!groupId) {
		// TODO: handle account deletion
		return new Response('Missing group ID', { status: 400 });
	}

	try {
		await removeStudentFromGroup(+id, +groupId);
		return new Response('Student removed from group', { status: 200 });
	} catch (err) {
		console.error('Error removing student from group:', err);
		return new Response('Error removing student from group', { status: 500 });
	}
};
