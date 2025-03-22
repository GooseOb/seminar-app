// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type Message = {
		id: number;
		text: string;
		user: { id: string; name: string; photo?: string };
		timestamp: Date;
		isPending?: boolean;
	};
}

export {};
