import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema, source: 'body' | 'query') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: result.error.flatten().fieldErrors,
      });
      return;
    }
    req[source] = result.data;
    next();
  };
}

export function requireUserId(req: Request, res: Response, next: NextFunction): void {
  const userId = req.headers['x-user-id'];
  if (!userId || typeof userId !== 'string') {
    res.status(401).json({ error: 'X-User-Id header is required', code: 'UNAUTHORIZED' });
    return;
  }
  next();
}
