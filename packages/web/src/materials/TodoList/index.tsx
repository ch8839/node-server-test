// TodoList.tsx

import React, { useState } from "react";
import { Input, Button } from "antd";
import {
  useGetTodoList,
  useCreateTodo,
  useDeleteTodo,
} from "./hooks/useActions";

const TodoList = () => {
  const { data, error, isLoading, mutate } = useGetTodoList();
  const { trigger, isMutating } = useCreateTodo();
  const { trigger: deleteTrigger } = useDeleteTodo();
  const [title, setTitle] = useState("");
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;
  const todos = data?.data?.list || [];
  // console.log(">>>todos", todos);
  const handleCreateTodo = async () => {
    try {
      await trigger({
        title: title,
        content: "New Todo Content",
        priority: 1,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTrigger({ id });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <h1>TodoList</h1>
      <div className="flex gap-2">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        <Button onClick={handleCreateTodo}>Create Todo</Button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>
            <span>{"  |  "}</span>
            <span>{todo.content}</span>
            <Button onClick={() => handleDeleteTodo(todo.id)}>Delete</Button>
          </li>
          // <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
