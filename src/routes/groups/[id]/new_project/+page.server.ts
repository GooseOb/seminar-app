import { redirect } from '$lib/i18n';
import { insertProject, isMemberOfGroup } from '$lib/server/queries';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, params: { id }, locals: { user } }) => {
		if (user.role !== 'student') {
			return fail(403, {
				error: 'You are not allowed to create a project'
			});
		}
		if (!(await isMemberOfGroup(user!.id, +id))) {
			return fail(403, {
				error: 'You are not a member of this group'
			});
		}

		const form = await request.formData();
		const name = form.get('name_en') as string;
		const namePl = form.get('name_pl') as string;
		const description = form.get('description') as string;
		const thesis = form.get('thesis') as string;

		if (!name || !namePl) {
			return fail(400, {
				error: 'Name is required'
			});
		}

		let projectId: number;

		try {
			projectId = (
				await insertProject(+id, {
					name,
					namePl,
					description,
					thesis,
					ownerId: user!.id
				})
			).id;
		} catch (error) {
			console.error('Error updating project:', error);
			return fail(500, {
				error: 'Error creating project'
			});
		}

		redirect(303, `/projects/${projectId}`);
	}
} satisfies Actions;
