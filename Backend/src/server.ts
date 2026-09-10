import 'dotenv/config';
import { createApp } from './app.js';
import { redisService } from './shared/infrastructure/redis/redis.service.js';

const app = createApp();
const PORT = process.env.PORT || 5000;

// Connect to Redis asynchronously
redisService.connect().catch((err) => {
  console.warn('Initial Redis connection deferred:', err.message);
});

const server = app.listen(PORT, () => {
  console.log(`🚀 AutoVersus API (Stateless Modular Monolith) listening on http://localhost:${PORT}`);
});

const handleShutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  await redisService.quit();
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));