import { insertGroupWithStudents } from '$lib/server/queries';
import type { NoId, User } from '$lib/server/schema';
import type { Actions } from './$types';
import type { StudentData } from './dto';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const name = form.get('name') as string;
		const students = JSON.parse(form.get('students') as string).map(
			({ firstname, lastname, login, password }: StudentData): NoId<User> => ({
				firstname,
				lastname,
				login,
				password,
				role: 'student',
				photo: null
			})
		);

		await insertGroupWithStudents(name, locals.user!.id, students);
	}
};
