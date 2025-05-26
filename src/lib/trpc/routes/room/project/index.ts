import { updateProjectEditable } from '$lib/server/db/queries/project/updateEditable';
import { t } from '$lib/trpc/t';
import { lecturerProcedure } from './middleware';
import { thesisRouter } from './thesis';
import { z } from 'zod';

export const projectRouter = t.router({
	thesis: thesisRouter,
	setEditable: lecturerProcedure
		.input(z.object({ editable: z.boolean() }))
		.mutation(async ({ input: { roomId, editable } }) => {
			await updateProjectEditable(+roomId, editable);
		})
});
