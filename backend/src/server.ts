import app from '@/app';
import config from '@/config';

const server = app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});

const handleShutdown = (signal: string) => {
  console.log(`Received ${signal}. Closing server...`);
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => handleShutdown('SIGINT'));

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
