import { redirect } from '$lib/i18n';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params: { id } }) => {
	redirect(307, `/groups/${id}/chat`);
};
