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

	type Project = {
		id: string;
		name: string;
	};

	type Group = {
		id: string;
		name: string;
		projects: Project[];
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
