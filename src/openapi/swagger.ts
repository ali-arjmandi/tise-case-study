import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { generateSpec } from './spec';

export function mountSwagger(app: Application): void {
  const spec = generateSpec();
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
  app.get('/docs.json', (_req, res) => res.json(spec));
}
