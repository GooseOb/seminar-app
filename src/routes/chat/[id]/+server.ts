import { isRoomMember } from '$lib/server/db/queries/room/isMember';
import { getRoom } from '$lib/trpc/routes/room/chat.js';
import { error } from '@sveltejs/kit';

export const GET = async ({
	request,
	params: { id: roomId },
	platform,
	locals: {
		user: { id }
	}
}) => {
	if (request.headers.get('Upgrade') !== 'websocket') {
		throw error(400, 'Expected Upgrade: websocket');
	}
	if (!(await isRoomMember(id, +roomId))) {
		error(403, 'You are not a member of this room');
	}

	const res = await getRoom(platform!.env, roomId).fetch(request);

	return new Response(res.body, res);
};
