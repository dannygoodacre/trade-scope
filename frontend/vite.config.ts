import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@trade-tracker/shared': path.resolve(__dirname, '../shared/src'),
    },
  },
})
