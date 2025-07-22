import { relations } from "drizzle-orm/relations";
import { users, projects, lists, tasks, comments } from "./schema";

export const projectsRelations = relations(projects, ({one, many}) => ({
	user: one(users, {
		fields: [projects.ownerId],
		references: [users.id]
	}),
	lists: many(lists),
}));

export const usersRelations = relations(users, ({many}) => ({
	projects: many(projects),
	tasks: many(tasks),
	comments: many(comments),
}));

export const listsRelations = relations(lists, ({one, many}) => ({
	project: one(projects, {
		fields: [lists.projectId],
		references: [projects.id]
	}),
	tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({one, many}) => ({
	user: one(users, {
		fields: [tasks.assigneeId],
		references: [users.id]
	}),
	list: one(lists, {
		fields: [tasks.listId],
		references: [lists.id]
	}),
	comments: many(comments),
}));

export const commentsRelations = relations(comments, ({one}) => ({
	task: one(tasks, {
		fields: [comments.taskId],
		references: [tasks.id]
	}),
	user: one(users, {
		fields: [comments.authorId],
		references: [users.id]
	}),
}));