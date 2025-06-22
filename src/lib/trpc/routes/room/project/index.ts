import { updateProjectEditable } from '$lib/server/db/queries/project/updateEditable';
import { checkLecturer } from '$lib/trpc/checks/role';
import { roomProcedure } from '$lib/trpc/middleware/room';
import { t } from '$lib/trpc/t';
import { thesisRouter } from './thesis';
import { z } from 'zod';

export const projectRouter = t.router({
	thesis: thesisRouter,
	setEditable: roomProcedure
		.use(checkLecturer)
		.input(z.object({ editable: z.boolean() }))
		.mutation(async ({ input: { roomId, editable } }) => {
			await updateProjectEditable(roomId, editable);
		})
});
