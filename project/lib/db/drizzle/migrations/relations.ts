import { relations } from "drizzle-orm/relations";
import { tasks, taskAssignments, users, projects, lists, projectMembers, roles, taskDiscussions, permissions, rolePermissions } from "./schema";

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
	taskDiscussions: many(taskDiscussions),
}));

export const usersRelations = relations(users, ({many}) => ({
	taskAssignments: many(taskAssignments),
	projects: many(projects),
	lists: many(lists),
	projectMembers: many(projectMembers),
	tasks: many(tasks),
	taskDiscussions: many(taskDiscussions),
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
	role: one(roles, {
		fields: [projectMembers.roleId],
		references: [roles.id]
	}),
	user: one(users, {
		fields: [projectMembers.userId],
		references: [users.id]
	}),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	projectMembers: many(projectMembers),
	rolePermissions: many(rolePermissions),
}));

export const taskDiscussionsRelations = relations(taskDiscussions, ({one}) => ({
	user: one(users, {
		fields: [taskDiscussions.authorId],
		references: [users.id]
	}),
	task: one(tasks, {
		fields: [taskDiscussions.taskId],
		references: [tasks.id]
	}),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({one}) => ({
	permission: one(permissions, {
		fields: [rolePermissions.permissionId],
		references: [permissions.id]
	}),
	role: one(roles, {
		fields: [rolePermissions.roleId],
		references: [roles.id]
	}),
}));

export const permissionsRelations = relations(permissions, ({many}) => ({
	rolePermissions: many(rolePermissions),
}));