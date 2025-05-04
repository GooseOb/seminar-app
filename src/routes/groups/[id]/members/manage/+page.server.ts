import type { PageServerLoad } from './$types';
import { getStudentsInGroup } from '$lib/server/queries';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({
	params: { id },
	locals: { user }
}) => {
	try {
		const students = await getStudentsInGroup(+id, user!.id);
		return {
			students
		};
	} catch (err) {
		console.error('Error loading group members:', err);
		return error(500, {
			message: 'Error loading group members'
		});
	}
};
