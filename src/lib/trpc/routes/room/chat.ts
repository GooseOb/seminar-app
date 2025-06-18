import { insertMessage } from '$lib/server/db/queries/message/insert';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { roomProcedure } from './middleware';

export const getRoom = (env: Env, roomId: string) =>
	env.CHATROOM.get(env.CHATROOM.idFromName(roomId));

export const chatRouter = t.router({
	sendMessage: roomProcedure.input(z.object({ text: z.string() })).mutation(
		async ({
			ctx: {
				platform,
				locals: { user }
			},
			input: { roomId, text }
		}) => {
			const message = await insertMessage({
				senderId: user.id,
				roomId,
				text
			});

			await getRoom(platform!.env, roomId.toString()).fetch(
				'http://dummy/message',
				{
					method: 'POST',
					body: JSON.stringify(message),
					headers: { 'Content-Type': 'application/json' }
				}
			);

			return message;
		}
	)
});
