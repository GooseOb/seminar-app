import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const name = form.get('name')?.toString();
		const students = form.get('students')?.toString();
		console.log(name);
		console.log(students);
	}
};
