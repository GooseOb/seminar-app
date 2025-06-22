import { removeMemberFromRoom } from '$lib/server/db/queries/room/removeMember';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { groupOwnerProcedure } from './middleware';

export const groupRouter = t.router({
	removeStudent: groupOwnerProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input: { groupId, id } }) => {
			await removeMemberFromRoom(id, groupId);
		})
});
