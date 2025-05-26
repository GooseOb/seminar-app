import {
	boolean,
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

export const user = pgTable('user', {
	id: serial().primaryKey(),
	firstname: varchar({ length: 255 }).notNull(),
	lastname: varchar({ length: 255 }).notNull(),
	login: varchar({ length: 255 }).notNull().unique(),
	password: varchar({ length: 255 }).notNull(),
	hasPhoto: boolean().notNull().default(false),
	role: roleEnum().notNull()
});

export const studentLecturer = pgTable('student_lecturer', {
	studentId: integer()
		.notNull()
		.references(() => user.id),
	// added by
	lecturerId: integer()
		.notNull()
		.references(() => user.id)
});

export const roomKindEnum = pgEnum('room_kind', ['group', 'project']);

export const room = pgTable('room', {
	id: serial().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	ownerId: integer()
		.notNull()
		.references(() => user.id),
	kind: roomKindEnum().notNull()
});

export const roomMembership = pgTable(
	'room_membership',
	{
		userId: integer()
			.notNull()
			.references(() => user.id),
		roomId: integer()
			.notNull()
			.references(() => room.id)
	},
	(table) => [primaryKey({ columns: [table.userId, table.roomId] })]
);

export const project = pgTable('project', {
	id: serial()
		.primaryKey()
		.references(() => room.id),
	groupId: integer()
		.notNull()
		.references(() => room.id),
	namePl: varchar({ length: 255 }).notNull(),
	description: text(),
	thesis: text(),
	editable: boolean().notNull().default(true)
});

export const message = pgTable('message', {
	id: serial().primaryKey(),
	createdAt: timestamp({
		withTimezone: true,
		mode: 'date'
	})
		.notNull()
		.defaultNow(),
	roomId: integer()
		.notNull()
		.references(() => room.id),
	senderId: integer()
		.notNull()
		.references(() => user.id),
	text: text().notNull()
});

export const session = pgTable('session', {
	id: text().primaryKey(),
	userId: integer()
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp({
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export type NoId<T> = Omit<T, 'id'>;
export type User = InferSelectModel<typeof user>;
export type Session = InferSelectModel<typeof session>;
export type Project = InferSelectModel<typeof project>;
export type ProjectRoom = Room & Omit<Project, 'groupId'>;
export type Message = InferSelectModel<typeof message>;
export type Role = InferEnum<typeof roleEnum>;
export type RoomKind = InferEnum<typeof roomKindEnum>;
export type RoomMembership = InferSelectModel<typeof roomMembership>;
export type StudentLecturer = InferSelectModel<typeof studentLecturer>;
export type Room = InferSelectModel<typeof room>;
