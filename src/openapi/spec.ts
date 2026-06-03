import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './registry';

export function generateSpec() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Tise API',
      version: '1.0.0',
      description: 'Proof-of-concept marketplace API for Tise',
    },
    servers: [{ url: '/api' }],
  });
}
