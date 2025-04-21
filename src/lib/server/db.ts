import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	varchar
} from 'drizzle-orm/pg-core';

import type { InferSelectModel } from 'drizzle-orm';

export const db = drizzle(DATABASE_URL);

export const roleEnum = pgEnum('role', ['student', 'teacher']);

export const userTable = pgTable('user', {
	id: serial('id').primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull().unique(),
	role: roleEnum().notNull()
});

export const roomKindEnum = pgEnum('room_kind', ['group', 'project']);

const roomTable = pgTable('room', {
	id: serial('id').primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	ownerId: integer('owner_id')
		.notNull()
		.references(() => userTable.id),
	kind: roomKindEnum().notNull()
});

export const groupTable = pgTable('group', {
	id: serial('id')
		.primaryKey()
		.references(() => roomTable.id)
});

export const groupMembershipTable = pgTable(
	'group_membership',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.notNull()
			.references(() => userTable.id),
		groupId: integer('group_id')
			.notNull()
			.references(() => groupTable.id)
	},
	(table) => [primaryKey({ columns: [table.userId, table.groupId] })]
);

export const projectTable = pgTable('project', {
	id: serial('id')
		.primaryKey()
		.references(() => roomTable.id),
	groupId: integer('group_id')
		.notNull()
		.references(() => groupTable.id)
});

export const messageTable = pgTable('message', {
	id: serial('id').primaryKey(),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull(),
	roomId: integer('room_id')
		.notNull()
		.references(() => roomTable.id),
	senderId: integer('sender_id')
		.notNull()
		.references(() => userTable.id),
	text: text('text').notNull()
});

export const sessionTable = pgTable('session', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
export type Group = InferSelectModel<typeof groupTable>;
export type Project = InferSelectModel<typeof projectTable>;
export type Message = InferSelectModel<typeof messageTable>;
