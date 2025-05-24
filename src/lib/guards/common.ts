import { error } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

type CheckFn<TProps extends any[]> = (
	...props: TProps
) => boolean | Promise<boolean>;

export const createUserIdCheck =
	(
		check: CheckFn<[userId: number, paramsId: number]>,
		getMessage: () => string
	) =>
	async (id: number) => {
		const {
			locals: { user }
		} = getRequestEvent();

		if (!(await check(user!.id, +id!))) {
			throw error(403, {
				message: getMessage()
			});
		}
	};
