import { isMemberOfGroup } from '$lib/server/queries';
import { error } from '@sveltejs/kit';

export const groupMembershipGuard =
	<T extends { locals: App.Locals; params: { id: string } }, U>(
		fn: (args: T) => U
	) =>
	async (props: T) => {
		const {
			locals,
			params: { id }
		} = props;
		if (await isMemberOfGroup(locals.user!.id, +id)) {
			return fn(props);
		}
		error(403, {
			message: 'You are not a member of this group'
		});
	};
