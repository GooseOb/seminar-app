import type { PageServerLoad } from './$types';
import {
	getGroupOwner,
	getStudentsWithProjectsInGroup
} from '$lib/server/queries';
import { error } from '@sveltejs/kit';

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const load: PageServerLoad = async ({
	params: { id },
	locals: {
		user: { role }
	}
}) => {
	try {
		return {
			students: getStudentsWithProjectsInGroup(+id),
			lecturer: getGroupOwner(+id),
			role
		};
	} catch (err) {
		console.error('Error loading group members:', err);
		return error(500, {
			message: 'Error loading group members'
		});
	}
};
