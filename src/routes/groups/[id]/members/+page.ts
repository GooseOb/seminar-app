import type { PageLoad } from './$types';

export const load: PageLoad = async (): Promise<
	{ members: (User & { projectId?: string })[] } | { error: string }
> => {
	return true
		? {
				members: [
					{
						id: '1',
						name: 'User 1',
						photo: 'https://i.pravatar.cc/300',
						isOnline: true,
						projectId: '1'
					},
					{
						id: '2',
						name: 'User 2',
						photo: 'https://i.pravatar.cc/300',
						isOnline: false
					}
				] as User[]
			}
		: {
				error: 'Group not found'
			};
};
