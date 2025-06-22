import { removeMemberFromRoom } from '$lib/server/db/queries/room/removeMember';
import { groupOwnerProcedure } from '$lib/trpc/middleware/groupOwner';
import { t } from '$lib/trpc/t';
import { z } from 'zod';

export const groupRouter = t.router({
	removeStudent: groupOwnerProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input: { groupId, id } }) => {
			await removeMemberFromRoom(id, groupId);
		})
});
