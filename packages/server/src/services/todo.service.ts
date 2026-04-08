import { prisma } from '../lib/prisma';
import { AppError } from '../types';
import type { Prisma } from '@prisma/generated';
import type { CreateTodoType, UpdateTodoType } from '@monorepo/shared/schemas/todo.schema';

export class TodoService {
  async findAll(params: { page: number; pageSize: number; completed?: boolean; title?: string }) {
    const { page, pageSize, completed, title } = params;
    const where: Prisma.TodoWhereInput = {};

    if (completed !== undefined) {
      where.completed = completed;
    }

    if (title) {
      where.title = { contains: title };
    }

    const [list, total] = await Promise.all([
      prisma.todo.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.todo.count({ where }),
    ]);

    return { list, total, page, pageSize };
  }

  async findById(id: number) {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) {
      throw new AppError('Todo not found', 404);
    }
    return todo;
  }

  async create(data: CreateTodoType) {
    return prisma.todo.create({ data });
  }

  async update(id: number, data: UpdateTodoType) {
    await this.findById(id);
    return prisma.todo.update({ where: { id }, data });
  }

  async delete(id: number) {
    await this.findById(id);
    return prisma.todo.delete({ where: { id } });
  }
}

export const todoService = new TodoService();
