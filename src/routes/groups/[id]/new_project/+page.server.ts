import { redirect } from '$lib/i18n';
import { insertProject } from '$lib/server/queries';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, params: { id }, locals: { user } }) => {
		const form = await request.formData();
		const name = form.get('name_en') as string;
		const namePl = form.get('name_pl') as string;
		const description = form.get('description') as string;
		const thesis = form.get('thesis') as string;

		if (!name || !namePl) {
			return {
				error: 'Name is required'
			};
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
			return {
				error: 'An error occurred while updating the project'
			};
		}

		redirect(303, `/projects/${projectId}`);
	}
} satisfies Actions;
