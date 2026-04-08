import type { Request, Response, NextFunction } from 'express';
import { todoService } from '../services/todo.service';
import type { ApiResponse, PaginatedData } from '../types';
import type { Todo } from '@prisma/generated';

function success<T>(res: Response<ApiResponse<T>>, data: T, message = 'ok', code = 200) {
  res.status(code).json({ code, data, message });
}

export class TodoController {
  async getAll(req: Request, res: Response<ApiResponse<PaginatedData<Todo>>>, next: NextFunction) {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 10));
      const title = req.query.title as string | undefined;
      const completed =
        req.query.completed === undefined ? undefined : req.query.completed === 'true';

      const data = await todoService.findAll({ page, pageSize, completed, title });
      success(res, data);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response<ApiResponse<Todo>>, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data = await todoService.findById(id);
      success(res, data);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response<ApiResponse<Todo>>, next: NextFunction) {
    try {
      const data = await todoService.create(req.body);
      success(res, data, 'Created', 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response<ApiResponse<Todo>>, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data = await todoService.update(id, req.body);
      success(res, data);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response<ApiResponse<null>>, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await todoService.delete(id);
      success(res, null, 'Deleted');
    } catch (err) {
      next(err);
    }
  }
}

export const todoController = new TodoController();
