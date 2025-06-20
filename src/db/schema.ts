import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import {z} from "zod"

/**
 * Todos table schema definition
 *
 * Represents the core data structure for todo items in the application
 */
export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  completed: boolean("completed").notNull().default(false),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const selectTodoSchema = createSelectSchema(todos)

export type Todo = z.infer<typeof selectTodoSchema>
