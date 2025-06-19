/**
 * Core type definitions for the Todo application
 */

/**
 * Represents a Todo item in the application
 */
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Input type for creating a new Todo
 */
export interface CreateTodoInput {
  text: string;
}

/**
 * Input type for updating an existing Todo
 */
export interface UpdateTodoInput {
  id: number;
  text?: string;
  completed?: boolean;
}
