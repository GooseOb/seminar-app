import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { Router } from './routes';

export const trpc = createTRPCClient<Router>({
	links: [
		httpBatchLink({
			url: '/api/trpc'
		})
	]
});
