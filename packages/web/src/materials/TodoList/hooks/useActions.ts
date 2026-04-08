import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  CreateTodoType,
  UpdateTodoType,
  QueryParamsType,
} from '@monorepo/shared/schemas/todo.schema';
import { getTodoList, createTodo, deleteTodo, updateTodo } from '../api';
import { IdParamsType } from '../types';

export const useGetTodoList = (params?: QueryParamsType) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ['/todos', params],
    () => getTodoList(params),
    { keepPreviousData: true },
  );
  return { data, error, isLoading, isValidating, mutate };
};

export const useCreateTodo = () => {
  const { trigger, isMutating } = useSWRMutation(
    '/todos/create',
    (_, { arg }: { arg: CreateTodoType }) => createTodo(arg),
    {
      onSuccess: () => {},
    },
  );
  return { trigger, isMutating };
};

export const useDeleteTodo = () => {
  const { trigger, isMutating } = useSWRMutation(
    '/todos/delete',
    (_, { arg }: { arg: IdParamsType }) => deleteTodo(arg.id),

    {
      onSuccess: () => {},
    },
  );
  return { trigger, isMutating };
};

export const useUpdateTodo = () => {
  const { trigger, isMutating } = useSWRMutation(
    '/todos/update',
    (_, { arg: { id, ...body } }: { arg: UpdateTodoType & IdParamsType }) => updateTodo(id, body),
    {
      onSuccess: () => {},
    },
  );
  return { trigger, isMutating };
};
