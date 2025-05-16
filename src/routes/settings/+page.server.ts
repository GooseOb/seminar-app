import type { Theme } from '$lib/theme';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const theme = cookies.get('theme') as Theme;
	return {
		theme
	};
};
