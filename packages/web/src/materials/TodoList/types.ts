export interface Todo {
  id: number;
  title: string;
  content?: string;
  completed?: boolean;
  priority?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IdParamsType = Pick<Todo, "id">;
