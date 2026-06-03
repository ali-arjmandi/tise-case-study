import request from 'supertest';
import app from '../src/app';
import { seed } from '../src/db/seeds';
import { resetStore } from '../src/db/store';

beforeEach(() => {
  resetStore();
  seed();
});

describe('GET /api/categories', () => {
  it('returns all categories', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(18);
  });

  it('each category has id, title, and icon', async () => {
    const res = await request(app).get('/api/categories');
    res.body.forEach((cat: any) => {
      expect(cat).toHaveProperty('id');
      expect(cat).toHaveProperty('title');
      expect(cat).toHaveProperty('icon');
    });
  });
});
