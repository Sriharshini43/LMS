import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,  // Ensures proper routing in dev mode
  },
  build: {
    outDir: 'dist',  // Default output folder for Vercel
  },
});
