import { room, user } from '$lib/server/db';
import { getTableColumns } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export const userData = (() => {
	const { password, ...data } = getTableColumns(user);
	return data;
})();

export const projectRoom = alias(room, 'project_room');

export const first = <T extends any[]>(arr: Promise<T>): Promise<T[number]> =>
	arr.then((a) => a[0]);
