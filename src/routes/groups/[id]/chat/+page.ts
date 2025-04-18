import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return {
		messages: [
			{
				id: 1,
				text: 'Hey there!',
				user: { id: 'bot1', name: 'User' },
				timestamp: new Date(),
			},
		] as Message[],
	};
};
