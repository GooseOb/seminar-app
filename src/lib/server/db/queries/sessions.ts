import { sha256 } from '@oslojs/crypto/sha2';
import {
	encodeBase32LowerCaseNoPadding,
	encodeHexLowerCase
} from '@oslojs/encoding';
import { eq } from 'drizzle-orm';
import { db, type Session, type User, session, user } from '$lib/server/db';

export const generateSessionToken = (): string => {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
};

export const createSession = async (
	token: string,
	userId: number
): Promise<Session> => {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const sessionData: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	console.log(await db().insert(session).values(sessionData).returning());
	return sessionData;
};

export const validateSessionToken = async (
	token: string
): Promise<SessionValidationResult> => {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await db()
		.select({ user, session })
		.from(session)
		.innerJoin(user, eq(session.userId, user.id))
		.where(eq(session.id, sessionId));
	if (result.length < 1) {
		return { session: null, user: null };
	}
	const res = result[0];
	if (Date.now() >= res.session.expiresAt.getTime()) {
		await db().delete(session).where(eq(session.id, session.id));
		return { session: null, user: null };
	}
	if (
		Date.now() >=
		res.session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15
	) {
		res.session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db()
			.update(session)
			.set({
				expiresAt: session.expiresAt
			})
			.where(eq(session.id, session.id));
	}
	return res;
};

export const invalidateSession = async (sessionId: string): Promise<void> => {
	await db().delete(session).where(eq(session.id, sessionId));
};

export const invalidateAllSessions = async (userId: number): Promise<void> => {
	await db().delete(session).where(eq(session.userId, userId));
};

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };
