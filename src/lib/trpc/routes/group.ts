import { isRoomOwner } from '$lib/server/db/queries/group/isOwner';
import { removeMemberFromRoom } from '$lib/server/db/queries/room/removeMember';
import { error } from '@sveltejs/kit';
import { t } from '../t';
import { z } from 'zod';
import * as m from '$lib/paraglide/messages';

const groupOwnerProcedure = t.procedure
	.input(z.object({ groupId: z.number() }))
	.use(
		async ({
			ctx: {
				locals: {
					user: { id }
				}
			},
			input: { groupId },
			next
		}) => {
			if (!(await isRoomOwner(id, +groupId))) {
				error(403, m.notRoomOwner());
			}
			return next();
		}
	);

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
