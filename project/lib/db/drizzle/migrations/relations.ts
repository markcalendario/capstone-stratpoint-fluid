import { relations } from "drizzle-orm/relations";
import { tasks, comments, users, lists, projects, teams, taskAssignments } from "./schema";

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

export const tasksRelations = relations(tasks, ({one, many}) => ({
	comments: many(comments),
	list: one(lists, {
		fields: [tasks.listId],
		references: [lists.id]
	}),
	user: one(users, {
		fields: [tasks.createdBy],
		references: [users.id]
	}),
	taskAssignments: many(taskAssignments),
}));

export const usersRelations = relations(users, ({many}) => ({
	comments: many(comments),
	tasks: many(tasks),
	lists: many(lists),
	projects: many(projects),
	teams: many(teams),
	taskAssignments: many(taskAssignments),
}));

export const listsRelations = relations(lists, ({one, many}) => ({
	tasks: many(tasks),
	user: one(users, {
		fields: [lists.createdBy],
		references: [users.id]
	}),
	project: one(projects, {
		fields: [lists.projectId],
		references: [projects.id]
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