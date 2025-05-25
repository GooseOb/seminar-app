import { isRoomOwner } from '$lib/server/db/queries/group/isOwner';
import { error } from '@sveltejs/kit';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
import * as m from '$lib/paraglide/messages';

export const groupOwnerProcedure = t.procedure
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
