import type { RequestHandler } from '@sveltejs/kit';
import { insertMessage } from '$lib/server/queries';
import { json, error } from '@sveltejs/kit';

const clients = new Map<number, Set<ReadableStreamDefaultController>>();
const PING_INTERVAL = 30_000; // 30 seconds

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

	let streamController: ReadableStreamDefaultController | null = null;
	let pingInterval: NodeJS.Timeout | null = null;

	return new Response(
		new ReadableStream({
			start(controller) {
				console.log('Stream started for room:', roomId);
				streamController = controller;
				const encoder = new TextEncoder();

				if (!clients.has(roomId)) {
					clients.set(roomId, new Set());
				}
				const clientControllers = clients.get(roomId)!;
				clientControllers.add(controller);

				controller.enqueue(encoder.encode('data: {"type":"ping"}\n\n'));

				pingInterval = setInterval(() => {
					try {
						controller.enqueue(encoder.encode('data: {"type":"ping"}\n\n'));
					} catch (err) {
						console.error('Error sending ping:', err);
						clientControllers.delete(controller);
						if (clientControllers.size === 0) {
							clients.delete(roomId);
						}
						clearInterval(pingInterval!);
					}
				}, PING_INTERVAL);
			},
			cancel() {
				if (streamController) {
					clients.get(roomId)?.delete(streamController);
					if (clients.get(roomId)?.size === 0) {
						clients.delete(roomId);
					}
					if (pingInterval) {
						clearInterval(pingInterval);
					}
				}
			}
		})
	);
};
