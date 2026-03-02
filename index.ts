import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import {connectDb} from './api/config/db';
import {env} from './api/config/env';
import routes from './api/routes';
import {errorHandler} from './api/middleware/errorHandler';
import {sanitize} from './api/middleware/sanitize';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(sanitize);

app.use('/api', routes);

//Delete after all prod finished-
app.get('/', async (req, res) => {
  res.send('Hello production!');
});

app.use(errorHandler);

connectDb()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`Server listening on port ${env.PORT}`);
    });
  })
  .catch(error => {
    console.error('Failed to connect to database', error);
    process.exit(1);
  });
