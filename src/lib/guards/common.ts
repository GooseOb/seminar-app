import { error } from '@sveltejs/kit';

type CheckFn<TProps extends any[]> = (
	...props: TProps
) => boolean | Promise<boolean>;

export const createGuard =
	<TProps>(check: CheckFn<[TProps]>, getMessage: () => string) =>
	<TFnProps extends TProps, TResult, TFn extends (props: TFnProps) => TResult>(
		fn: TFn
	) =>
	async (props: TFnProps) => {
		if (await check(props)) {
			return fn(props);
		}
		throw error(403, {
			message: getMessage()
		});
	};

export const createUserIdGuard = (
	check: CheckFn<[userId: number, paramsId: number]>,
	getMessage: () => string
) =>
	createGuard<{ locals: App.Locals; params: { id: string } }>(
		({ locals: { user }, params: { id } }) => check(user!.id, +id),
		getMessage
	);
