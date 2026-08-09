import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  },
  test: {
    globals: true,
    environment: 'node',
    env: {
      DATABASE_CONNECTION_STRING: ':memory:'
    }
  }
});
