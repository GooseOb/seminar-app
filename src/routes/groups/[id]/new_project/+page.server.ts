import { redirect } from '$lib/i18n';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { isRoomMember } from '$lib/server/db/queries/room/isMember';
import { insertProject } from '$lib/server/db/queries/project/insert';
import * as m from '$lib/paraglide/messages';

export const actions = {
	default: async ({ request, params: { id }, locals: { user } }) => {
		if (user.role !== 'student') {
			return fail(403, {
				error: m.notAllowedToCreateProject()
			});
		}
		if (!(await isRoomMember(user!.id, +id))) {
			return fail(403, {
				error: m.notRoomMember()
			});
		}

		const form = await request.formData();
		const name = form.get('name_en') as string;
		const namePl = form.get('name_pl') as string;
		const description = form.get('description') as string;
		const thesis = form.get('thesis') as string;

		if (!name || !namePl) {
			return fail(400, {
				error: m.nameRequired()
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
					ownerId: user!.id,
					editable: true
				})
			).id;
		} catch (error) {
			console.error('Error updating project:', error);
			return fail(500, {
				error: m.internalError()
			});
		}

		redirect(303, `/projects/${projectId}`);
	}
} satisfies Actions;
