import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
const qalamApi = process.env.VITE_QALAM_API_NAME;
const baseUrl = process.env.VITE_QALAM_BASE_URL;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      [qalamApi]: baseUrl,
      },
    watch: {
      usePolling: true,
    } 
  },
})
