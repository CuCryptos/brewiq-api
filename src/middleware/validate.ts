import { Request, Response, NextFunction } from 'express';
import { ZodSchema, z } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

interface ValidateOptions {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: result.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }

    req[target] = result.data;
    next();
  };
}

export function validateRequest(options: ValidateOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: Array<{ target: string; field: string; message: string }> = [];

    if (options.body) {
      const result = options.body.safeParse(req.body);
      if (!result.success) {
        errors.push(
          ...result.error.errors.map((e) => ({
            target: 'body',
            field: e.path.join('.'),
            message: e.message,
          })),
        );
      } else {
        req.body = result.data;
      }
    }

    if (options.query) {
      const result = options.query.safeParse(req.query);
      if (!result.success) {
        errors.push(
          ...result.error.errors.map((e) => ({
            target: 'query',
            field: e.path.join('.'),
            message: e.message,
          })),
        );
      } else {
        req.query = result.data;
      }
    }

    if (options.params) {
      const result = options.params.safeParse(req.params);
      if (!result.success) {
        errors.push(
          ...result.error.errors.map((e) => ({
            target: 'params',
            field: e.path.join('.'),
            message: e.message,
          })),
        );
      } else {
        req.params = result.data;
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: errors,
      });
      return;
    }

    next();
  };
}
