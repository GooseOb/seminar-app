import type { LayoutLoad } from './$types';

export const load: LayoutLoad<{ groups: Group[] }> = async () => {
	let projectId = 0;
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
		}))
	};
};
