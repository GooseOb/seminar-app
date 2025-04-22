import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	let projectId = 0;
	console.log('locals', locals);
	const { role } = locals.user;
	return {
		groups: Array.from({ length: 7 }, (_, i) => ({
			id: i.toString(),
			name: 'Group ' + i,
			projects: Array.from({ length: Math.floor(Math.random() * 5) }, () => ({
				id: `${projectId}`,
				name: {
					en: `Project ${projectId}`,
					pl: `Projekt ${projectId++}`
				},
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
			}))
		})),
		role
	};
};
