import type { RequestHandler } from '@sveltejs/kit';
import { insertMessage } from '$lib/server/queries';
import { json, error } from '@sveltejs/kit';

const clients = new Map<number, Set<ReadableStreamDefaultController>>();

function broadcast(roomId: number, message: any) {
	const clientControllers = clients.get(roomId);
	if (clientControllers) {
		for (const controller of clientControllers) {
			const encoder = new TextEncoder();
			try {
				controller.enqueue(
					encoder.encode(
						`data: ${JSON.stringify({ type: 'message', ...message })}\n\n`
					)
				);
			} catch (err) {
				console.error('Error broadcasting message:', err);
				clients.get(roomId)?.delete(controller);
			}
		}
	}
}

export const POST: RequestHandler = async ({
	request,
	params: { id },
	locals
}) => {
	const { text } = await request.json();
	const userId = locals.user?.id;

	if (!id || !text || !userId) {
		return error(400, 'Missing required fields');
	}
	const roomId = +id;

	try {
		const savedMessage = await insertMessage({
			senderId: userId,
			roomId,
			text
		});

		broadcast(roomId, savedMessage);

		return json(savedMessage);
	} catch (err) {
		console.error('Error saving message:', err);
		return error(500, 'Failed to save message');
	}
};

export const GET: RequestHandler = async ({ params: { id }, setHeaders }) => {
	if (!id) {
		return error(400, 'Room ID is required');
	}
	const roomId = +id;

	setHeaders({
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive'
	});

	return new Response(
		new ReadableStream({
			start(controller) {
				const encoder = new TextEncoder();

				if (clients.has(roomId)) {
					clients.get(roomId)!.add(controller);
				} else {
					clients.set(roomId, new Set([controller]));
				}

				controller.enqueue(encoder.encode('data: {"type":"ping"}\n\n'));

				return () => {
					clients.get(roomId)?.delete(controller);
					if (clients.get(roomId)?.size === 0) {
						clients.delete(roomId);
					}
					controller.close();
				};
			},
			cancel() {
				const controllers = clients.get(roomId);
				if (controllers) {
					clients.delete(roomId);
					for (const controller of controllers) {
						controller.close();
					}
				}
			}
		})
	);
};
