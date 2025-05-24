import { getUserById } from '$lib/server/db/queries/user/getById';
import { t } from '../t';
import { z } from 'zod';

export const studentRouter = t.router({
	get: t.procedure.input(z.number()).query(({ input }) => getUserById(input))
});
