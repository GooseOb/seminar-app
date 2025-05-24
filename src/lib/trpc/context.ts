import type { RequestEvent } from '@sveltejs/kit';

export const createContext = (event: RequestEvent) => event;

export type Context = Awaited<ReturnType<typeof createContext>>;
