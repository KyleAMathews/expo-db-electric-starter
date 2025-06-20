import { createInsertSchema } from "drizzle-zod";
import { todos } from "./schema";

// Schema for inserting a new todo
const insertSchema = createInsertSchema(todos);

// We don't want to require id, created_at, or updated_at on insert
export const insertTodoSchema = insertSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
});

// For updates, all fields are optional.
export const updateTodoSchema = insertTodoSchema.partial();

// Validation functions
export function validateInsertTodo(data: unknown) {
  return insertTodoSchema.parse(data);
}

export function validateUpdateTodo(data: unknown) {
  return updateTodoSchema.parse(data);
}
