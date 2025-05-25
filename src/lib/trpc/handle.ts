import type { Handle } from '@sveltejs/kit';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { router } from './routes';

export const handleTrpc: Handle = ({ event, resolve }) =>
	event.url.pathname.startsWith('/api/trpc')
		? fetchRequestHandler({
				endpoint: '/api/trpc',
				req: event.request,
				router: router,
				createContext: () => event
			})
		: resolve(event);
