import { relations } from "drizzle-orm/relations";
import { lists, tasks, comments, users, projects, teams, taskAssignments } from "./schema";

export const tasksRelations = relations(tasks, ({one, many}) => ({
	list: one(lists, {
		fields: [tasks.listId],
		references: [lists.id]
	}),
	comments: many(comments),
	taskAssignments: many(taskAssignments),
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

export const usersRelations = relations(users, ({many}) => ({
	comments: many(comments),
	projects: many(projects),
	lists: many(lists),
	teams: many(teams),
	taskAssignments: many(taskAssignments),
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

export const taskAssignmentsRelations = relations(taskAssignments, ({one}) => ({
	task: one(tasks, {
		fields: [taskAssignments.taskId],
		references: [tasks.id]
	}),
	user: one(users, {
		fields: [taskAssignments.userId],
		references: [users.id]
	}),
}));