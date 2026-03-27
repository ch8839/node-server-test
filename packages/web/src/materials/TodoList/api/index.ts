import { fetcher } from "@/utils/fetcher";
import { CreateTodoType, UpdateTodoType } from '@monorepo/shared/schemas/todo.schema';
import { Todo } from "../types";

const BASE_URL = "/api/todos";

export const getTodoList = async () => {
  const res = await fetcher<{ data: { list: Todo[] } }>(`${BASE_URL}`, {
    params: {
      page: 1,
      pageSize: 10,
    },
  });
  return res;
};

export const getTodoById = async (id: number) => {
  const res = await fetcher<{ data: Todo }>(`${BASE_URL}/${id}`);
  return res;
};

export const createTodo = async (body: CreateTodoType) => {
  const res = await fetcher(`${BASE_URL}/create`, {
    method: "POST",
    body: {
      ...body,
      // updatedAt: new Date(),
    },
  });
  return res;
};

export const deleteTodo = async (id: number) => {
  const res = await fetcher(`${BASE_URL}/${id}`, {
    method: "DELETE",
    // body: { id },
  });
  return res;
};

export const updateTodo = async (id: number, body: UpdateTodoType) => {
  const res = await fetcher(`${BASE_URL}/${id}`, {
    method: "PUT",
    body,
  });
  return res;
};