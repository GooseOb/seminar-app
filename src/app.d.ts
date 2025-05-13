import type { User } from '$lib/server/schema';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session?: Session;
			/*
			 * Undefined only in /login and /register routes
			 */
			user: User;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}
	}
	type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
}

export {};
