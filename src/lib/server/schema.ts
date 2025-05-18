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
	id: serial().primaryKey(),
	firstname: varchar({ length: 255 }).notNull(),
	lastname: varchar({ length: 255 }).notNull(),
	login: varchar({ length: 255 }).notNull().unique(),
	password: varchar({ length: 255 }).notNull(),
	photo: varchar({ length: 2048 }),
	role: roleEnum().notNull()
});

export const studentLecturerTable = pgTable('student_lecturer', {
	studentId: integer()
		.notNull()
		.references(() => userTable.id),
	// added by
	lecturerId: integer()
		.notNull()
		.references(() => userTable.id)
});

export const roomKindEnum = pgEnum('room_kind', ['group', 'project']);

export const roomTable = pgTable('room', {
	id: serial().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	ownerId: integer()
		.notNull()
		.references(() => userTable.id),
	kind: roomKindEnum().notNull()
});

export const groupTable = pgTable('group', {
	id: serial()
		.primaryKey()
		.references(() => roomTable.id)
});

export const groupMembershipTable = pgTable(
	'group_membership',
	{
		userId: integer()
			.notNull()
			.references(() => userTable.id),
		groupId: integer()
			.notNull()
			.references(() => groupTable.id)
	},
	(table) => [primaryKey({ columns: [table.userId, table.groupId] })]
);

export const projectTable = pgTable('project', {
	id: serial()
		.primaryKey()
		.references(() => roomTable.id),
	groupId: integer()
		.notNull()
		.references(() => groupTable.id),
	namePl: varchar({ length: 255 }).notNull(),
	description: text(),
	thesis: text()
});

export const messageTable = pgTable('message', {
	id: serial().primaryKey(),
	createdAt: timestamp({
		withTimezone: true,
		mode: 'date'
	})
		.notNull()
		.defaultNow(),
	roomId: integer()
		.notNull()
		.references(() => roomTable.id),
	senderId: integer()
		.notNull()
		.references(() => userTable.id),
	text: text().notNull()
});

export const sessionTable = pgTable('session', {
	id: text().primaryKey(),
	userId: integer()
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp({
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export type NoId<T> = Omit<T, 'id'>;
export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
export type Group = InferSelectModel<typeof groupTable>;
export type Project = InferSelectModel<typeof projectTable>;
export type ProjectRoom = Room & Omit<Project, 'groupId'>;
export type Message = InferSelectModel<typeof messageTable>;
export type Role = InferEnum<typeof roleEnum>;
export type RoomKind = InferEnum<typeof roomKindEnum>;
export type GroupMembership = InferSelectModel<typeof groupMembershipTable>;
export type StudentLecturer = InferSelectModel<typeof studentLecturerTable>;
export type Room = InferSelectModel<typeof roomTable>;
