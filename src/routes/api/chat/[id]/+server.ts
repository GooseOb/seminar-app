// src/routes/api/chat/[id]/+server.ts
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { insertMessage } from '$lib/server/queries';

const roomStub = (env: Env, roomId: string) =>
	env.CHATROOM.get(env.CHATROOM.idFromName(roomId));

export const POST: RequestHandler = async ({
	request,
	params: { id },
	locals,
	platform
}) => {
	const { text } = await request.json();
	const senderId = locals.user?.id;

	if (!text || !senderId || !id) {
		throw error(400, 'Missing fields');
	}

	const message = await insertMessage({ senderId, roomId: +id, text });

	await roomStub(platform.env, id).fetch('http://dummy/message', {
		method: 'POST',
		body: JSON.stringify(message),
		headers: { 'Content-Type': 'application/json' }
	});

	return json(message);
};

export const GET: RequestHandler = async ({
	request,
	params: { id },
	platform
}) => {
	if (!id) throw error(400, 'Room ID required');

	const upgradeHeader = request.headers.get('Upgrade');
	if (upgradeHeader !== 'websocket') {
		throw error(400, 'Expected Upgrade: websocket');
	}

	return roomStub(platform.env, id).fetch(request);
};
