import { projectAccessGuard } from '$lib/guards/projectAccess';
import { getProject, getUserById, updateProject } from '$lib/server/queries';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = projectAccessGuard(
	async ({ params: { id } }) => {
		const project = getProject(+id);
		const student = project.then(({ ownerId }) => getUserById(ownerId));

		return {
			project,
			student
		};
	}
);

export const actions = {
	default: projectAccessGuard(async ({ request, params: { id } }) => {
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

		try {
			await updateProject(+id, { name, namePl, description, thesis });
		} catch (error) {
			console.error('Error updating project:', error);
			return {
				error: 'An error occurred while updating the project'
			};
		}

		return {
			success: true
		};
	})
} satisfies Actions;
