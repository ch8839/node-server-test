import { prisma } from '../lib/prisma';
import { AppError } from '../types';
import type { Prisma } from '@prisma/client';

export class TodoService {
  async findAll(params: {
    page: number;
    pageSize: number;
    completed?: boolean;
  }) {
    const { page, pageSize, completed } = params;
    const where: Prisma.TodoWhereInput = {};

    if (completed !== undefined) {
      where.completed = completed;
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

  async create(data: { title: string; content?: string; priority?: number }) {
    return prisma.todo.create({ data });
  }

  async update(
    id: number,
    data: { title?: string; content?: string; completed?: boolean; priority?: number },
  ) {
    await this.findById(id);
    return prisma.todo.update({ where: { id }, data });
  }

  async delete(id: number) {
    await this.findById(id);
    return prisma.todo.delete({ where: { id } });
  }
}

export const todoService = new TodoService();
