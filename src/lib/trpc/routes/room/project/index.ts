import { t } from '$lib/trpc/t';
import { lecturerProcedure } from './middleware';
import { thesisRouter } from './thesis';
import { z } from 'zod';

export const projectRouter = t.router({
	thesis: thesisRouter,
	changeAcceptance: lecturerProcedure
		.input(z.object({ accepted: z.boolean() }))
		.mutation(async ({ input: { roomId, accepted } }) => {
			// TODO: Implement the logic to change the acceptance status of a project.

			return { roomId, accepted };
		})
});
