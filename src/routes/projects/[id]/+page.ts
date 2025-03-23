import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params: { id } }) => {
	redirect(307, `/projects/${id}/chat`);
};
