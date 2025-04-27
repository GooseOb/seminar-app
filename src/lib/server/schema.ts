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

import type { InferEnum, InferSelectModel } from 'drizzle-orm';

export const roleEnum = pgEnum('role', ['student', 'lecturer']);

export const userTable = pgTable('user', {
	id: serial('id').primaryKey(),
	firstname: varchar({ length: 255 }).notNull(),
	lastname: varchar({ length: 255 }).notNull(),
	login: varchar({ length: 255 }).notNull().unique(),
	password: varchar({ length: 255 }).notNull(),
	photo: varchar({ length: 255 }),
	role: roleEnum().notNull()
});

export const roomKindEnum = pgEnum('room_kind', ['group', 'project']);

export const roomTable = pgTable('room', {
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
export type Role = InferEnum<typeof roleEnum>;
