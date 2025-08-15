import { relations } from "drizzle-orm/relations";
import { lists, tasks, users, comments, projects, teams, taskAssignments } from "./schema";

export const tasksRelations = relations(tasks, ({one, many}) => ({
	list: one(lists, {
		fields: [tasks.listId],
		references: [lists.id]
	}),
	user: one(users, {
		fields: [tasks.createdBy],
		references: [users.id]
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

export const usersRelations = relations(users, ({many}) => ({
	tasks: many(tasks),
	comments: many(comments),
	lists: many(lists),
	projects: many(projects),
	teams: many(teams),
	taskAssignments: many(taskAssignments),
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
	lists: many(lists),
	user: one(users, {
		fields: [projects.ownerId],
		references: [users.id]
	}),
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