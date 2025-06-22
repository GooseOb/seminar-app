import { error } from '@sveltejs/kit';
import { t } from '$lib/trpc/t';

export const checkRole = (role: string) =>
	t.middleware(
		({
			ctx: {
				locals: { user }
			},
			next
		}) => {
			if (user.role !== role) {
				error(403, `Only ${role}s can perform this action`);
			}
			return next();
		}
	);

export const checkLecturer = checkRole('lecturer');
export const checkStudent = checkRole('student');
