import { pgTable, unique, uuid, text, timestamp, foreignKey, integer, boolean, date, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const priority = pgEnum("PRIORITY", ['low', 'medium', 'high'])


export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	clerkId: text().notNull(),
	email: text().notNull(),
	name: text().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	imageUrl: text().notNull(),
}, (table) => [
	unique("users_clerkId_key").on(table.clerkId),
]);

export const comments = pgTable("comments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	content: text().notNull(),
	taskId: uuid().notNull(),
	authorId: uuid().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.taskId],
			foreignColumns: [tasks.id],
			name: "taskComment"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [users.id],
			name: "commentAuthor"
		}).onDelete("cascade"),
]);

export const lists = pgTable("lists", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	projectId: uuid().notNull(),
	position: integer(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	isFinal: boolean().default(false),
	createdBy: uuid().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.id],
			name: "projectList"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "userList"
		}).onDelete("cascade"),
]);

export const projects = pgTable("projects", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	ownerId: uuid().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	dueDate: date().notNull(),
	active: boolean().default(true),
}, (table) => [
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [users.id],
			name: "projectOwner"
		}).onDelete("cascade"),
]);

export const tasks = pgTable("tasks", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	listId: uuid().notNull(),
	priority: priority().notNull(),
	dueDate: date().notNull(),
	position: integer(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.listId],
			foreignColumns: [lists.id],
			name: "listTask"
		}).onDelete("cascade"),
]);

export const teams = pgTable("teams", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid().notNull(),
	projectId: uuid().notNull(),
	isAccepted: boolean(),
	invitedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	acceptedAt: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "memberUserData"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.id],
			name: "projectMember"
		}).onDelete("cascade"),
]);

export const taskAssignments = pgTable("taskAssignments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	taskId: uuid().notNull(),
	userId: uuid().notNull(),
	assignedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_DATE`),
}, (table) => [
	foreignKey({
			columns: [table.taskId],
			foreignColumns: [tasks.id],
			name: "taskAssignment"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "userTaskAssignment"
		}).onDelete("cascade"),
]);
