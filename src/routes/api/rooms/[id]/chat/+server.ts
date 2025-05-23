import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { insertMessage } from '$lib/server/db/queries/message/insert';

const roomStub = (env: Env, roomId: string) =>
	env.CHATROOM.get(env.CHATROOM.idFromName(roomId));

export const POST: RequestHandler = async ({
	request,
	params: { id },
	locals: { user },
	platform
}) => {
	const { text } = await request.json();

	if (!text || !id) {
		throw error(400, 'Missing fields');
	}

	const message = await insertMessage({ senderId: user.id, roomId: +id, text });

	await roomStub(platform!.env, id).fetch('http://dummy/message', {
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
	console.log('GET request for room:', id);
	if (!id) throw error(400, 'Room ID required');

	const upgradeHeader = request.headers.get('Upgrade');
	if (upgradeHeader !== 'websocket') {
		throw error(400, 'Expected Upgrade: websocket');
	}

	const res = await roomStub(platform!.env, id).fetch(request);

	return new Response(res.body, res);
};
