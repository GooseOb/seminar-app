// src/routes/api/chat/[id]/+server.ts
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { insertMessage } from '$lib/server/queries';

/** Helper: given env + id return a stub for the correct chat-room object */
function roomStub(env: Env, roomId: string) {
	return env.CHATROOM.get(env.CHATROOM.idFromName(roomId));
}

export const POST: RequestHandler = async ({
	request,
	params,
	locals,
	platform
}) => {
	const { text } = await request.json();
	const userId = locals.user?.id;
	const roomId = +params.id;

	if (!text || !userId || !roomId) {
		throw error(400, 'Missing fields');
	}

	const message = await insertMessage({ senderId: userId, roomId, text });

	const stub = roomStub(platform.env, params.id);

	await stub.fetch('http://dummy/message', {
		method: 'POST',
		body: JSON.stringify(message),
		headers: { 'Content-Type': 'application/json' }
	});

	return json(message);
};

export const GET: RequestHandler = async ({ request, params, platform }) => {
	const roomId = params.id;
	if (!roomId) throw error(400, 'Room ID required');

	const stub = roomStub(platform.env, roomId);

	// Forward the WebSocket request to the Durable Object
	const upgradeHeader = request.headers.get('Upgrade');
	if (upgradeHeader !== 'websocket') {
		throw error(400, 'Expected Upgrade: websocket');
	}

	return stub.fetch(request);
};
