import { removeMemberFromRoom } from '$lib/server/db/queries/room/removeMember';
import { error } from '@sveltejs/kit';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { groupOwnerProcedure } from './middleware';

export const groupRouter = t.router({
	removeStudent: groupOwnerProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input: { groupId, id } }) => {
			try {
				await removeMemberFromRoom(id, groupId);
			} catch (err) {
				console.error('Error removing student from group:', err);
				error(500, 'Error removing student from group');
			}
		})
});
