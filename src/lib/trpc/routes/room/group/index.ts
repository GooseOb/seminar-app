import { removeMemberFromRoom } from '$lib/server/db/queries/room/removeMember';
import { roomOwnerProcedure } from '$lib/trpc/middleware/room';
import { t } from '$lib/trpc/t';
import { z } from 'zod';

export const groupRouter = t.router({
	removeStudent: roomOwnerProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input: { roomId, id } }) => {
			await removeMemberFromRoom(id, roomId);
		})
});
