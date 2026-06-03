import app from './app';
import { seed } from './db/seeds';

const PORT = process.env.PORT ?? 3000;

seed();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/docs`);
});
