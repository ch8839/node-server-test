import { fetcher } from '@/utils/fetcher';
import { CreateTodoType, UpdateTodoType } from '@monorepo/shared/schemas/todo.schema';
import { Todo } from '../types';

const BASE_URL = '/api/todos';

interface TodoListData {
  list: Todo[];
  total: number;
  page: number;
  pageSize: number;
}

export const getTodoList = async (params?: {
  page?: number;
  pageSize?: number;
  title?: string;
}) => {
  return fetcher<TodoListData>(BASE_URL, { params });
};

export const getTodoById = async (id: number) => {
  return fetcher<Todo>(`${BASE_URL}/${id}`);
};

export const createTodo = async (body: CreateTodoType) => {
  return fetcher<Todo>(`${BASE_URL}/create`, { method: 'POST', body });
};

export const deleteTodo = async (id: number) => {
  return fetcher<null>(`${BASE_URL}/${id}`, { method: 'DELETE' });
};

export const updateTodo = async (id: number, body: UpdateTodoType) => {
  return fetcher<Todo>(`${BASE_URL}/${id}`, { method: 'PUT', body });
};
