import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { browser } from '$app/environment';
import { page } from '$app/state';
import type { Router } from './routes';

export const trpc = createTRPCClient<Router>({
	links: [
		httpBatchLink({
			url: browser ? '/api/trpc' : `${page.url.origin}/api/trpc`
		})
	]
});
