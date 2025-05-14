import { error } from '@sveltejs/kit';

type Bool = boolean | Promise<boolean>;

export const createGuard =
	<T>(check: (props: T) => Bool, message: () => string) =>
	(fn: <U>(props: T) => U) =>
	async (props: T) => {
		if (await check(props)) {
			return fn(props);
		}
		throw error(403, {
			message: message()
		});
	};

export const createUserIdGuard = (
	check: (userId: number, paramsId: number) => Bool,
	message: () => string
) =>
	createGuard<{ locals: App.Locals; params: { id: string } }>(
		({ locals: { user }, params: { id } }) => check(user!.id, +id),
		message
	);
