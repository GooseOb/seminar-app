import { db, groupMembership } from '$lib/server/db';
import { sql, eq, and } from 'drizzle-orm';

const membershipQuery = () =>
	db()
		.select({})
		.from(groupMembership)
		.where(
			and(
				eq(groupMembership.userId, sql.placeholder('userId')),
				eq(groupMembership.groupId, sql.placeholder('groupId'))
			)
		)
		.limit(1)
		.prepare('membershipQuery');

export const isMemberOfGroup = (
	userId: number,
	groupId: number
): Promise<boolean> =>
	membershipQuery()
		.execute({
			userId,
			groupId
		})
		.then(({ length }) => length > 0);
