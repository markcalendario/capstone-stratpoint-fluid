import { sql } from "drizzle-orm";
import { foreignKey, integer, pgEnum, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const priority = pgEnum("PRIORITY", ['low', 'medium', 'high'])


export const projects = pgTable("projects", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	ownerId: uuid().notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	dueDate: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [users.id],
			name: "projectOwner"
		}),
]);

export const lists = pgTable("lists", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	projectId: uuid().notNull(),
	position: integer().notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.id],
			name: "projectList"
		}),
]);

export const tasks = pgTable("tasks", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	listId: uuid().notNull(),
	assigneeId: uuid().notNull(),
	priority: priority().notNull(),
	dueDate: timestamp({ mode: 'string' }).notNull(),
	position: integer().notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.assigneeId],
			foreignColumns: [users.id],
			name: "taskAssignee"
		}),
	foreignKey({
			columns: [table.listId],
			foreignColumns: [lists.id],
			name: "listTask"
		}),
]);

export const comments = pgTable("comments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	content: text().notNull(),
	taskId: uuid().notNull(),
	authorId: uuid().notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.taskId],
			foreignColumns: [tasks.id],
			name: "taskComment"
		}),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [users.id],
			name: "commentAuthor"
		}),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	clerkId: text().notNull(),
	email: text().notNull(),
	name: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	unique("users_clerkId_key").on(table.clerkId),
]);
