import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { connectDb } from './config/db';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { sanitize } from './middleware/sanitize';

const app = express();

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(sanitize);

app.use('/api', routes);

app.use(errorHandler);

connectDb()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`Server listening on port ${env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database', error);
    process.exit(1);
  });
