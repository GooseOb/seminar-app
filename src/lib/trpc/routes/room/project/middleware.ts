import { error } from '@sveltejs/kit';
import { roomProcedure } from '../middleware';

const getRoleProcedure = (role: string) =>
	roomProcedure.use(
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

export const studentProcedure = getRoleProcedure('student');
export const lecturerProcedure = getRoleProcedure('lecturer');
