import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
  CreateTodoType,
  UpdateTodoType,
} from "@monorepo/shared/schemas/todo.schema";
import { getTodoList, createTodo, deleteTodo, updateTodo } from "../api";
import { IdParamsType } from "../types";

export const useGetTodoList = () => {
  const { data, error, isLoading, mutate } = useSWR("/todos", getTodoList);
  return { data, error, isLoading, mutate };
};

export const useCreateTodo = () => {
  const { mutate } = useGetTodoList();
  const { trigger, isMutating } = useSWRMutation(
    "/todos/create",
    (_, { arg }: { arg: CreateTodoType }) => createTodo(arg),
    {
      onSuccess: () => {
        mutate();
      },
    }
  );
  return { trigger, isMutating };
};

export const useDeleteTodo = () => {
  const { mutate } = useGetTodoList();
  const { trigger, isMutating } = useSWRMutation(
    "/todos/delete",
    (_, { arg }: { arg: IdParamsType }) => deleteTodo(arg.id),

    {
      onSuccess: () => {
        mutate();
      },
    }
  );
  return { trigger, isMutating };
};

export const useUpdateTodo = () => {
  const { mutate } = useGetTodoList();
  const { trigger, isMutating } = useSWRMutation(
    "/todos/update",
    (_, { arg: { id, ...body } }: { arg: UpdateTodoType & IdParamsType }) =>
      updateTodo(id, body),
    {
      onSuccess: () => {
        mutate();
      },
    }
  );
  return { trigger, isMutating };
};
