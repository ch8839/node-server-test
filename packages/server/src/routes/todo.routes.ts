import { Router } from 'express';
import { todoController } from '../controllers/todo.controller';
import { validate } from '../middlewares/validate';
import {
  queryParamsSchema,
  idParamsSchema,
  createTodoSchema,
  updateTodoSchema,
} from '@monorepo/shared/schemas/todo.schema';

const router = Router();

router.get('/', validate({ params: queryParamsSchema }), (req, res, next) =>
  todoController.getAll(req, res, next),
);

router.get('/:id', validate({ params: idParamsSchema }), (req, res, next) =>
  todoController.getById(req, res, next),
);

router.post('/create', validate({ body: createTodoSchema }), (req, res, next) =>
  todoController.create(req, res, next),
);

router.put('/:id', validate({ params: idParamsSchema, body: updateTodoSchema }), (req, res, next) =>
  todoController.update(req, res, next),
);

router.delete('/:id', validate({ params: idParamsSchema }), (req, res, next) =>
  todoController.delete(req, res, next),
);

export default router;
