import { checkProjectAccess } from '$lib/guards/projectAccess';
import { getProject } from '$lib/server/db/queries/project/get';
import { updateProject } from '$lib/server/db/queries/project/update';
import { getUserById } from '$lib/server/db/queries/user/getById';
import type { Actions, PageServerLoad } from './$types';
import * as m from '$lib/paraglide/messages';

export const load: PageServerLoad = async ({ params: { id } }) => {
	await checkProjectAccess(+id);

	const project = getProject(+id);
	const student = project.then(({ ownerId }) => getUserById(ownerId));

	return {
		project,
		student
	};
};

export const actions = {
	default: async ({ request, params: { id } }) => {
		await checkProjectAccess(+id);

		const form = await request.formData();
		const name = form.get('name_en') as string;
		const namePl = form.get('name_pl') as string;
		const description = form.get('description') as string;
		const thesis = form.get('thesis') as string;

		if (!name || !namePl) {
			return {
				error: m.nameRequired()
			};
		}

		try {
			await updateProject(+id, { name, namePl, description, thesis });
		} catch (error) {
			console.error('Error updating project:', error);
			return {
				error: m.internalError()
			};
		}

		return {
			success: true
		};
	}
} satisfies Actions;
