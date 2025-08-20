import { relations } from "drizzle-orm/relations";
import { tasks, taskAssignments, users, projects, lists, projectMembers, teamRoles, comments } from "./schema";

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

export const tasksRelations = relations(tasks, ({one, many}) => ({
	taskAssignments: many(taskAssignments),
	list: one(lists, {
		fields: [tasks.listId],
		references: [lists.id]
	}),
	user: one(users, {
		fields: [tasks.createdBy],
		references: [users.id]
	}),
	comments: many(comments),
}));

export const usersRelations = relations(users, ({many}) => ({
	taskAssignments: many(taskAssignments),
	projects: many(projects),
	lists: many(lists),
	projectMembers: many(projectMembers),
	tasks: many(tasks),
	comments: many(comments),
}));

export const projectsRelations = relations(projects, ({one, many}) => ({
	user: one(users, {
		fields: [projects.ownerId],
		references: [users.id]
	}),
	lists: many(lists),
	projectMembers: many(projectMembers),
}));

export const listsRelations = relations(lists, ({one, many}) => ({
	user: one(users, {
		fields: [lists.createdBy],
		references: [users.id]
	}),
	project: one(projects, {
		fields: [lists.projectId],
		references: [projects.id]
	}),
	tasks: many(tasks),
}));

export const projectMembersRelations = relations(projectMembers, ({one}) => ({
	project: one(projects, {
		fields: [projectMembers.projectId],
		references: [projects.id]
	}),
	teamRole: one(teamRoles, {
		fields: [projectMembers.roleId],
		references: [teamRoles.id]
	}),
	user: one(users, {
		fields: [projectMembers.userId],
		references: [users.id]
	}),
}));

export const teamRolesRelations = relations(teamRoles, ({many}) => ({
	projectMembers: many(projectMembers),
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