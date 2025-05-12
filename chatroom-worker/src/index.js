export default {
	async fetch() {
		return new Response('Hello World!');
	}
};

export class ChatRoom {
	constructor() {
		this.sessions = new Set();
	}

	async fetch(request) {
		const upgradeHeader = request.headers.get('Upgrade');
		if (upgradeHeader !== 'websocket') {
			if (request.method === 'POST') {
				const message = await request.json();
				for (const ws of this.sessions) {
					try {
						ws.send(
							JSON.stringify({
								type: 'message',
								...message
							})
						);
					} catch (err) {
						console.error('Error sending message:', err);
						this.sessions.delete(ws);
					}
				}
				return new Response('Broadcasted', { status: 200 });
			}

			return new Response('Expected WebSocket', { status: 400 });
		}

		const [client, server] = Object.values(new WebSocketPair());
		server.accept();

		server.addEventListener('close', () => {
			this.sessions.delete(server);
		});

		this.sessions.add(server);

		return new Response(null, {
			status: 101,
			webSocket: client
		});
	}
}
