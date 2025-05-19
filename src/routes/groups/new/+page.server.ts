import { getUserByLogin, insertGroupWithStudents } from '$lib/server/queries';
import type { NoId, User } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { StudentData } from './dto';
import * as m from '$lib/paraglide/messages';
import { redirect } from '$lib/i18n';

export const actions: Actions = {
	create: async ({ request, locals: { user } }) => {
		if (user.role !== 'lecturer') {
			return fail(403, {
				error: 'You are not allowed to create a group'
			});
		}

		const form = await request.formData();
		const name = form.get('group_name') as string;
		const students = JSON.parse(form.get('students') as string).map(
			({ firstname, lastname, login, password }: StudentData): NoId<User> => ({
				firstname,
				lastname,
				login,
				password,
				role: 'student',
				hasPhoto: false
			})
		);

		const inviteeIds = JSON.parse(form.get('invitees') as string);
		let groupId: number;
		try {
			groupId = (
				await insertGroupWithStudents(name, user.id, students, inviteeIds)
			).group.id;
		} catch (error) {
			const number = /Key \(login\)=\(([^)]*)\) already exists/.exec(
				error.detail
			)?.[1];

			if (number) {
				return fail(400, {
					error: m.studentAlreadyExists({ number })
				});
			}

			console.error('Error inserting group with students:', error);
			return fail(500, {
				error: 'An error occurred while creating the group'
			});
		}

		throw redirect(303, `/groups/${groupId}/members`);
	},
	getStudent: async ({ request }) => {
		const form = await request.formData();
		const number = form.get('invitee_number') as string;

		const student = await getUserByLogin(number);
		if (!student) {
			return fail(400, {
				error: m.studentNotFound({ number })
			});
		}

		return {
			student,
			success: true
		};
	}
};
