import { isRoomMember } from '$lib/server/db/queries/room/isMember';
import { isRoomOwner } from '$lib/server/db/queries/group/isOwner';
import { t } from '$lib/trpc/t';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import * as m from '$lib/paraglide/messages';

const getRoomProcedure = (
	check: (id: number, roomId: number) => Promise<boolean> | boolean,
	getMessage: () => string
) =>
	t.procedure.input(z.object({ roomId: z.number() })).use(
		async ({
			ctx: {
				locals: {
					user: { id }
				}
			},
			input: { roomId },
			next
		}) => {
			if (!(await check(id, roomId))) {
				error(403, getMessage());
			}
			return next();
		}
	);

export const roomProcedure = getRoomProcedure(isRoomMember, m.notRoomMember);
export const roomOwnerProcedure = getRoomProcedure(isRoomOwner, m.notRoomOwner);
