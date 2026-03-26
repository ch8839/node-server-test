import { Router } from 'express';
import { todoController } from '../controllers/todo.controller';
import { validate } from '../middlewares/validate';
import { z } from 'zod';

const router = Router();

const idParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'id must be a number'),
});

const createBodySchema = z.object({
  title: z.string().min(1, 'title is required').max(255),
  content: z.string().optional(),
  priority: z.number().int().min(0).max(10).optional(),
});

const updateBodySchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().nullable().optional(),
  completed: z.boolean().optional(),
  priority: z.number().int().min(0).max(10).optional(),
});

router.get('/', (req, res, next) => todoController.getAll(req, res, next));

router.get(
  '/:id',
  validate({ params: idParamsSchema }),
  (req, res, next) => todoController.getById(req, res, next),
);

router.post(
  '/',
  validate({ body: createBodySchema }),
  (req, res, next) => todoController.create(req, res, next),
);

router.patch(
  '/:id',
  validate({ params: idParamsSchema, body: updateBodySchema }),
  (req, res, next) => todoController.update(req, res, next),
);

router.delete(
  '/:id',
  validate({ params: idParamsSchema }),
  (req, res, next) => todoController.delete(req, res, next),
);

export default router;
