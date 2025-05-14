import { hasAccessToProject } from '$lib/server/queries';
import { error } from '@sveltejs/kit';

export const projectAccessGuard =
	<T extends { locals: App.Locals; params: { id: string } }, U>(
		fn: (args: T) => U
	) =>
	async (props: T) => {
		const {
			locals,
			params: { id }
		} = props;
		if (await hasAccessToProject(locals.user!.id, +id)) {
			return fn(props);
		}
		error(403, {
			message: 'You do not have access to this project'
		});
	};
