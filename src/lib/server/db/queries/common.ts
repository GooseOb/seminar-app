import { room, user } from '$lib/server/db';
import { getTableColumns } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export const userData = (() => {
	const { password, ...data } = getTableColumns(user);
	return data;
})();

export const projectRoom = alias(room, 'project_room');
