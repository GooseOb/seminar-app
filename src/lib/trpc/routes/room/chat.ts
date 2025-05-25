import { insertMessage } from '$lib/server/db/queries/message/insert';
import { error } from '@sveltejs/kit';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { roomProcedure } from './middleware';

const roomStub = (env: Env, roomId: string) =>
	env.CHATROOM.get(env.CHATROOM.idFromName(roomId));

export const chatRouter = t.router({
	establishConnection: roomProcedure.query(
		async ({ ctx: { platform, request }, input: { roomId } }) => {
			if (request.headers.get('Upgrade') !== 'websocket') {
				throw error(400, 'Expected Upgrade: websocket');
			}

			const res = await roomStub(platform!.env, roomId).fetch(request);

			return new Response(res.body, res);
		}
	),
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
				roomId: +roomId,
				text
			});

			await roomStub(platform!.env, roomId).fetch('http://dummy/message', {
				method: 'POST',
				body: JSON.stringify(message),
				headers: { 'Content-Type': 'application/json' }
			});

			return message;
		}
	)
});
