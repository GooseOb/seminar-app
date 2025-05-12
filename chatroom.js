export class ChatRoom {
	constructor(state, env) {
		this.state = state;
		this.env = env;
		this.sessions = new Map(); // Map of WebSocket → user info
	}

	async fetch(request) {
		const upgradeHeader = request.headers.get('Upgrade');
		if (upgradeHeader !== 'websocket') {
			// Handle broadcast messages
			if (request.method === 'POST') {
				const message = await request.json();
				for (const [ws, user] of this.sessions.entries()) {
					try {
						ws.send(
							JSON.stringify({
								type: 'message',
								...message
							})
						);
					} catch (err) {
						this.sessions.delete(ws);
					}
				}
				return new Response('Broadcasted', { status: 200 });
			}

			return new Response('Expected WebSocket', { status: 400 });
		}

		const [client, server] = Object.values(new WebSocketPair());
		server.accept();

		server.addEventListener('message', (evt) => {
			// Optional: handle incoming messages from client if needed
		});

		server.addEventListener('close', () => {
			this.sessions.delete(server);
		});

		// Track the client
		this.sessions.set(server, {});

		return new Response(null, {
			status: 101,
			webSocket: client
		});
	}
}
