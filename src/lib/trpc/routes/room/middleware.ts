import { isRoomMember } from '$lib/server/db/queries/room/isMember';
import { t } from '$lib/trpc/t';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

export const roomProcedure = t.procedure
	.input(z.object({ roomId: z.number() }))
	.use(
		async ({
			ctx: {
				locals: {
					user: { id }
				}
			},
			input: { roomId },
			next
		}) => {
			if (!(await isRoomMember(id, roomId))) {
				error(403, 'You are not a member of this room');
			}
			return next();
		}
	);
