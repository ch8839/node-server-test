// TodoList.tsx

import React, { useState } from 'react';
import { Card, Input, Button, Modal, Form, Select, message, Tag, Tabs, Skeleton } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { useGetTodoList, useCreateTodo, useDeleteTodo, useUpdateTodo } from './hooks/useActions';
import { Todo, FormValuesType } from './types';
import { QueryParamsType } from '@monorepo/shared/schemas/todo.schema';

const TodoList = () => {
  const [searchParams, setSearchParams] = useState<QueryParamsType>({});
  const { data, error, isLoading, isValidating, mutate } = useGetTodoList(searchParams);

  const { trigger: createTrigger, isMutating } = useCreateTodo();
  const { trigger: deleteTrigger } = useDeleteTodo();
  const { trigger: updateTrigger } = useUpdateTodo();
  const [form] = Form.useForm<FormValuesType>();
  const [title, setTitle] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [activeTabKey, setActiveTabKey] = useState('all');

  // if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  const todos = data?.data?.list || [];
  const priorityOptions = [
    { label: 'P0', value: 0 },
    { label: 'P1', value: 1 },
    { label: 'P2', value: 2 },
  ];
  const prioritTextMap = priorityOptions.reduce(
    (acc, option) => {
      acc[option.value] = option.label;
      return acc;
    },
    {} as Record<number, string>,
  );
  const priorityColorMap: Record<number, string> = {
    0: 'red',
    1: 'blue',
    2: 'green',
  };
  // console.log(">>>todos", todos);
  const handleSearchTodo = async () => {
    setSearchParams({ ...searchParams, title: title });
  };

  const handleSearchTodoByTab = async (key: string) => {
    const completed = key === 'all' ? undefined : key === '1' ? true : false;
    setActiveTabKey(key);
    setSearchParams({ ...searchParams, completed });
  };

  const handleDeleteTodo = async (id: number) => {
    Modal.confirm({
      title: 'Delete Todo',
      content: 'Are you sure you want to delete this todo?',
      onOk: async () => {
        try {
          await deleteTrigger({ id });
          mutate();
          message.success('Delete todo success');
        } catch (error) {
          console.error(error);
          message.error((error as Error).message);
        }
      },
    });
  };

  const handleOpenCreateModal = () => {
    setModalOpen(true);
    setCurrentTodo(null);
  };

  const handleOpenUpdateModal = (todo: Todo) => {
    setModalOpen(true);
    setCurrentTodo(todo);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentTodo(null);
    form.resetFields();
  };

  const handleConfirm = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      if (currentTodo) {
        await updateTrigger({
          id: currentTodo?.id,
          ...values,
        });
      } else {
        await createTrigger(values);
      }
      mutate();
      setModalOpen(false);
    } catch (error) {
      message.error((error as Error).message);
      console.error(error);
    }
  };

  const handleCompleteTodo = async (todo: Todo) => {
    Modal.confirm({
      title: 'Complete Todo',
      content: 'Are you sure you want to complete this todo?',
      onOk: async () => {
        try {
          await updateTrigger({
            id: todo.id,
            completed: true,
          });
          await new Promise((resolve) => setTimeout(resolve, 1000));
          // await deleteTrigger({ id: todo.id });
          mutate();
          message.success('Complete todo success');
        } catch (error) {
          console.error(error);
          message.error((error as Error).message);
        }
      },
    });
  };

  return (
    <div className="flex-1">
      <h1>TodoList</h1>
      <br />
      <div className="flex gap-2">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        <Button loading={isValidating} onClick={handleSearchTodo}>
          Search
        </Button>
      </div>
      <br />
      <Button onClick={handleOpenCreateModal}>Create Todo</Button>
      <br />
      <Tabs
        activeKey={activeTabKey}
        items={[
          { label: 'All', key: 'all' },
          { label: 'Completed', key: '1' },
          { label: 'Uncompleted', key: '0' },
        ]}
        onChange={handleSearchTodoByTab}
      />
      <Skeleton loading={isLoading} active>
        <div className="flex flex-col gap-2">
          {todos.map((todo) => (
            <Card
              key={todo.id}
              title={todo.title}
              extra={
                <Tag color={priorityColorMap[todo.priority ?? 0]}>
                  {prioritTextMap[todo.priority ?? 0]}
                </Tag>
              }
              actions={[
                <EditOutlined key="edit" onClick={() => handleOpenUpdateModal(todo)} />,
                ...(todo.completed
                  ? []
                  : [<CheckOutlined key="complete" onClick={() => handleCompleteTodo(todo)} />]),
                <DeleteOutlined key="delete" onClick={() => handleDeleteTodo(todo.id)} />,
              ]}
            >
              <p>{todo.content}</p>
            </Card>
          ))}
        </div>
      </Skeleton>

      <Modal
        open={modalOpen}
        onCancel={handleCloseModal}
        onOk={handleConfirm}
        destroyOnHidden
        confirmLoading={isMutating}
      >
        <Form
          form={form}
          initialValues={currentTodo ?? undefined}
          layout="vertical"
          preserve={false}
        >
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Content" name="content">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Priority" name="priority">
            <Select options={priorityOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TodoList;
