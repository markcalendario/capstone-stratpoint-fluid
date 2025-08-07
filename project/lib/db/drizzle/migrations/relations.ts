import { relations } from "drizzle-orm/relations";
import { lists, tasks, users, comments, projects, teams } from "./schema";

export const tasksRelations = relations(tasks, ({one, many}) => ({
	list: one(lists, {
		fields: [tasks.listId],
		references: [lists.id]
	}),
	user: one(users, {
		fields: [tasks.assigneeId],
		references: [users.id]
	}),
	comments: many(comments),
}));

export const listsRelations = relations(lists, ({one, many}) => ({
	tasks: many(tasks),
	project: one(projects, {
		fields: [lists.projectId],
		references: [projects.id]
	}),
	user: one(users, {
		fields: [lists.createdBy],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	tasks: many(tasks),
	comments: many(comments),
	projects: many(projects),
	lists: many(lists),
	teams: many(teams),
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

export const projectsRelations = relations(projects, ({one, many}) => ({
	user: one(users, {
		fields: [projects.ownerId],
		references: [users.id]
	}),
	lists: many(lists),
	teams: many(teams),
}));

export const teamsRelations = relations(teams, ({one}) => ({
	user: one(users, {
		fields: [teams.userId],
		references: [users.id]
	}),
	project: one(projects, {
		fields: [teams.projectId],
		references: [projects.id]
	}),
}));