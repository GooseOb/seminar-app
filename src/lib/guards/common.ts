import { error } from '@sveltejs/kit';

type CheckFn<TProps extends any[]> = (
	...props: TProps
) => boolean | Promise<boolean>;

export const createGuard =
	<TProps>(check: CheckFn<[TProps]>, message: () => string) =>
	<TFnProps extends TProps, TResult, TFn extends (props: TFnProps) => TResult>(
		fn: TFn
	) =>
	async (props: TFnProps) => {
		if (await check(props)) {
			return fn(props);
		}
		throw error(403, {
			message: message()
		});
	};

export const createUserIdGuard = (
	check: CheckFn<[userId: number, paramsId: number]>,
	message: () => string
) =>
	createGuard<{ locals: App.Locals; params: { id: string } }>(
		({ locals: { user }, params: { id } }) => check(user!.id, +id),
		message
	);
