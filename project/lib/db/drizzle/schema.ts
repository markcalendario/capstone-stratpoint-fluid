import { sql } from "drizzle-orm";
import {
  bigint,
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique
} from "drizzle-orm/pg-core";

export const priority = pgEnum("PRIORITY", ["low", "medium", "high"]);

export const tasks = pgTable(
  "tasks",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity({
        name: "tasks_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1
      }),
    title: text().notNull(),
    description: text().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    listId: bigint({ mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    assigneeId: bigint({ mode: "number" }).notNull(),
    dueDate: timestamp({ mode: "string" }).notNull(),
    position: integer().notNull(),
    createdAt: timestamp({ mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.assigneeId],
      foreignColumns: [users.id],
      name: "taskAssignee"
    }),
    foreignKey({
      columns: [table.listId],
      foreignColumns: [lists.id],
      name: "listTask"
    })
  ]
);

export const users = pgTable(
  "users",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity({
        name: "users_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1
      }),
    clerkId: text().notNull(),
    email: text().notNull(),
    name: text().notNull(),
    createdAt: timestamp({ mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp({ mode: "string" }).default(sql`CURRENT_TIMESTAMP`)
  },
  (table) => [unique("users_clerkId_key").on(table.clerkId)]
);

export const projects = pgTable(
  "projects",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity({
        name: "projects_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1
      }),
    name: text().notNull(),
    description: text().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    ownerId: bigint({ mode: "number" }).notNull(),
    createdAt: timestamp({ mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp({ mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
    dueDate: timestamp({ mode: "string" }).notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.ownerId],
      foreignColumns: [users.id],
      name: "projectOwner"
    })
  ]
);

export const comments = pgTable(
  "comments",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity({
        name: "comments_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1
      }),
    content: text().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    taskId: bigint({ mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    authorId: bigint({ mode: "number" }).notNull(),
    createdAt: timestamp({ mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.taskId],
      foreignColumns: [tasks.id],
      name: "taskComment"
    }),
    foreignKey({
      columns: [table.authorId],
      foreignColumns: [users.id],
      name: "commentAuthor"
    })
  ]
);

export const lists = pgTable(
  "lists",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity({
        name: "lists_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 9223372036854775807,
        cache: 1
      }),
    name: text().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    projectId: bigint({ mode: "number" }).notNull(),
    position: integer().notNull(),
    createdAt: timestamp({ mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp({ mode: "string" }).default(sql`CURRENT_TIMESTAMP`)
  },
  (table) => [
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
      name: "projectList"
    })
  ]
);
