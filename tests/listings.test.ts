import request from 'supertest';
import app from '../src/app';
import { seed } from '../src/db/seeds';
import { resetStore } from '../src/db/store';

beforeEach(() => {
  resetStore();
  seed();
});

describe('GET /api/listings', () => {
  it('returns paginated listings with default params', async () => {
    const res = await request(app).get('/api/listings');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ total: 67, offset: 0, limit: 20 });
    expect(res.body.data).toHaveLength(20);
  });

  it('paginates correctly with offset and limit', async () => {
    const res = await request(app).get('/api/listings?offset=60&limit=10');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(10);
    expect(res.body.offset).toBe(60);
  });

  it('filters by category', async () => {
    const res = await request(app).get('/api/listings?category=wearables.clothes.dresses');
    expect(res.status).toBe(200);
    res.body.data.forEach((l: any) => expect(l.category).toBe('wearables.clothes.dresses'));
  });

  it('filters by size', async () => {
    const res = await request(app).get('/api/listings?size=S');
    expect(res.status).toBe(200);
    res.body.data.forEach((l: any) => expect(l.size.toLowerCase()).toBe('s'));
  });

  it('filters by sold status', async () => {
    const res = await request(app).get('/api/listings?sold=false');
    expect(res.status).toBe(200);
    res.body.data.forEach((l: any) => expect(l.sold).toBe(false));
  });

  it('searches by title', async () => {
    const res = await request(app).get('/api/listings?search=dress');
    expect(res.status).toBe(200);
    res.body.data.forEach((l: any) =>
      expect(l.title.toLowerCase() + l.caption.toLowerCase()).toContain('dress'),
    );
  });

  it('sorts by askingPrice asc', async () => {
    const res = await request(app).get('/api/listings?sortBy=askingPrice&sortOrder=asc&limit=100');
    expect(res.status).toBe(200);
    const prices: number[] = res.body.data.map((l: any) => l.askingPrice);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('sorts by likeCount desc', async () => {
    const res = await request(app).get('/api/listings?sortBy=likeCount&sortOrder=desc&limit=100');
    expect(res.status).toBe(200);
    const counts: number[] = res.body.data.map((l: any) => l.likeCount);
    expect(counts).toEqual([...counts].sort((a, b) => b - a));
  });

  it('returns liked:true for authenticated user who has liked', async () => {
    const listing = (await request(app).get('/api/listings?limit=1')).body.data[0];
    await request(app)
      .post(`/api/listings/${listing.id}/like`)
      .set('X-User-Id', 'test-user');

    const res = await request(app)
      .get('/api/listings?limit=100')
      .set('X-User-Id', 'test-user');

    const found = res.body.data.find((l: any) => l.id === listing.id);
    expect(found.liked).toBe(true);
  });
});

describe('GET /api/listings/:id', () => {
  it('returns a listing by id', async () => {
    const res = await request(app).get('/api/listings/61a2523e9b4e8800979b842a');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('61a2523e9b4e8800979b842a');
    expect(res.body).toHaveProperty('likeCount');
    expect(res.body).toHaveProperty('liked');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/listings/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('NOT_FOUND');
  });
});

describe('POST /api/listings', () => {
  const validBody = {
    title: 'Test Jacket',
    caption: 'A nice jacket',
    size: 'M',
    category: 'wearables.clothes.jackets',
    askingPrice: 500,
    currency: 'NOK',
    primaryImage: 'https://example.com/image.jpg',
  };

  it('creates a listing and returns 201', async () => {
    const res = await request(app)
      .post('/api/listings')
      .set('X-User-Id', 'user-1')
      .send(validBody);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Jacket');
    expect(res.body.owner.id).toBe('user-1');
    expect(res.body.sold).toBe(false);
  });

  it('returns 401 without X-User-Id', async () => {
    const res = await request(app).post('/api/listings').send(validBody);
    expect(res.status).toBe(401);
  });

  it('returns 400 for invalid body', async () => {
    const res = await request(app)
      .post('/api/listings')
      .set('X-User-Id', 'user-1')
      .send({ title: '' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for unknown category', async () => {
    const res = await request(app)
      .post('/api/listings')
      .set('X-User-Id', 'user-1')
      .send({ ...validBody, category: 'invalid.category' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/listings/:id/like', () => {
  const id = '61a2523e9b4e8800979b842a';

  it('likes a listing and increments likeCount', async () => {
    const before = (await request(app).get(`/api/listings/${id}`)).body.likeCount;
    await request(app).post(`/api/listings/${id}/like`).set('X-User-Id', 'new-user');
    const after = (await request(app).get(`/api/listings/${id}`)).body.likeCount;
    expect(after).toBe(before + 1);
  });

  it('is idempotent — liking twice does not double-count', async () => {
    await request(app).post(`/api/listings/${id}/like`).set('X-User-Id', 'new-user');
    const after1 = (await request(app).get(`/api/listings/${id}`)).body.likeCount;
    await request(app).post(`/api/listings/${id}/like`).set('X-User-Id', 'new-user');
    const after2 = (await request(app).get(`/api/listings/${id}`)).body.likeCount;
    expect(after1).toBe(after2);
  });

  it('returns 401 without X-User-Id', async () => {
    const res = await request(app).post(`/api/listings/${id}/like`);
    expect(res.status).toBe(401);
  });

  it('returns 404 for unknown listing', async () => {
    const res = await request(app).post('/api/listings/nonexistent/like').set('X-User-Id', 'user-1');
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/listings/:id/like', () => {
  const id = '61a2523e9b4e8800979b842a';

  it('unlikes a listing and decrements likeCount', async () => {
    await request(app).post(`/api/listings/${id}/like`).set('X-User-Id', 'new-user');
    const before = (await request(app).get(`/api/listings/${id}`)).body.likeCount;
    await request(app).delete(`/api/listings/${id}/like`).set('X-User-Id', 'new-user');
    const after = (await request(app).get(`/api/listings/${id}`)).body.likeCount;
    expect(after).toBe(before - 1);
  });

  it('is idempotent — unliking twice does not go negative', async () => {
    await request(app).delete(`/api/listings/${id}/like`).set('X-User-Id', 'no-such-user');
    const res = await request(app).get(`/api/listings/${id}`);
    expect(res.body.likeCount).toBeGreaterThanOrEqual(0);
  });

  it('returns 401 without X-User-Id', async () => {
    const res = await request(app).delete(`/api/listings/${id}/like`);
    expect(res.status).toBe(401);
  });
});
