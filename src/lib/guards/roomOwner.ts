import { isOwnerOfRoom } from '$lib/server/queries';
import { error } from '@sveltejs/kit';

export const roomOwnerGuard =
	<T extends { locals: { user: { id: number } }; params: { id: string } }, U>(
		fn: (args: T) => U
	) =>
	async (props: T) => {
		const {
			locals: { user },
			params: { id }
		} = props;
		if (await isOwnerOfRoom(user!.id, +id)) {
			return fn(props);
		}
		error(403, {
			message: 'You are not the owner of this room'
		});
	};
