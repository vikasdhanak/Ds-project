import 'dotenv/config';
import { createServer } from 'http';
import { app } from './app';
import { logger } from './config/logger';

const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || '0.0.0.0';

process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection: %s', reason?.stack || reason);
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception: %s', err.stack || err.message);
  process.exit(1);
});

const server = createServer(app);

server.listen(PORT, HOST, () => {
  const shownHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
  logger.info(`Server is running on http://${shownHost}:${PORT}`);
});