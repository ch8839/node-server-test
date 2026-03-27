import { Router } from 'express';
import { todoController } from '../controllers/todo.controller';
import { validate } from '../middlewares/validate';
import { idParamsSchema, createTodoSchema, updateTodoSchema } from '@monorepo/shared/schemas/todo.schema';

const router = Router();

router.get('/', (req, res, next) => todoController.getAll(req, res, next));

router.get(
  '/:id',
  validate({ params: idParamsSchema }),
  (req, res, next) => todoController.getById(req, res, next),
);

router.post(
  '/create',
  validate({ body: createTodoSchema }),
  (req, res, next) => todoController.create(req, res, next),
);

router.patch(
  '/:id',
  validate({ params: idParamsSchema, body: updateTodoSchema }),
  (req, res, next) => todoController.update(req, res, next),
);

router.delete(
  '/:id',
  validate({ params: idParamsSchema }),
  (req, res, next) => todoController.delete(req, res, next),
);

export default router;
