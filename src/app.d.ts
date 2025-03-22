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

	type Group = {
		id: string;
		name: string;
		photo?: string;
	};

	type User = {
		id: string;
		name: string;
		isOnline: boolean;
		photo?: string;
	};

	type Message = {
		id: number;
		text: string;
		user: User;
		timestamp: Date;
		isPending?: boolean;
	};
}

export {};
